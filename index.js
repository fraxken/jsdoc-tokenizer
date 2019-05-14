// Require Internal Dependencies
const { asciiSet, stringToChar } = require("./src/utils");
const jsdocKeywords = require("./src/keywords");
const BufferString = require("./src/bufferstring");

// AVAILABLE TOKENS
const TOKENS = Object.freeze({
    KEYWORD: Symbol("KEYWORD"),
    IDENTIFIER: Symbol("IDENTIFIER"),
    SYMBOL: Symbol("SYMBOL")
});

// CONSTANTS
const CHAR_SPACE = " ".charCodeAt(0);
const CHAR_EX = stringToChar("@example");
const CHAR_DESC = stringToChar("@desc");
const CHAR_DESCRIPTION = stringToChar("@description");

const CHAR_AROBASE = "@".charCodeAt(0);
const CHAR_STAR = "*".charCodeAt(0);
const CHAR_SLASH = "/".charCodeAt(0);
const CHAR_BRACKET_OPEN = "{".charCodeAt(0);
const CHAR_BRACKET_CLOSE = "}".charCodeAt(0);

const WIDE_CHARS = asciiSet(
    [48, 57], // 0-9
    [65, 90], // a-z
    [97, 122], // A-Z
    "_", "-", "$", "'", "\"", "<", ">", "@", ".", "!", "?",
    "(", ")", "#", "%", "&", "+", "-", ":", ";", "^", "`", "|", "~"
);

const SYMBOLS = new Set(["{", "}", "[", "]", "\n"].map((char) => char.charCodeAt(0)));
const KEYWORDS = jsdocKeywords.map((key) => stringToChar(key));

/**
 * @func isKeyword
 * @param {!BufferString} t8 keyword as uint8array
 * @returns {Boolean}
 */
function isKeyword(t8) {
    for (let id = 0; id < KEYWORDS.length; id++) {
        if (t8.compare(KEYWORDS[id])) {
            return true;
        }
    }

    return false;
}

/**
 * @typedef {Object} TokenRow
 * @property {Symbol} token
 * @property {Uint8Array | number} value
 */

/**
 * @generator
 * @func scan
 * @param {!Buffer} buf buffer
 * @returns {IterableIterator<TokenRow>}
 */
function* scan(buf) {
    const t8 = new BufferString();
    let skipSymbol = CHAR_AROBASE;
    let skipShowSymbol = false;
    let skipScan = false;

    for (let id = 0; id < buf.length; id++) {
        const char = buf[id];
        if (skipScan) {
            const isEndBlock = char === CHAR_SLASH && buf[id - 1] === CHAR_STAR;
            skipB: if (char === skipSymbol || isEndBlock) {
                if (char === CHAR_AROBASE && !isEndBlock && buf[id - 2] !== CHAR_STAR) {
                    break skipB;
                }
                skipScan = false;
                const currValue = isEndBlock ? t8.currValue.slice(0, -2) : t8.currValue;
                t8.reset();
                yield [TOKENS.IDENTIFIER, currValue];

                if (skipShowSymbol) {
                    yield [TOKENS.SYMBOL, skipSymbol];
                    skipShowSymbol = false;
                }
            }

            if (WIDE_CHARS.has(char)) {
                t8.add(char);
            }
            continue;
        }

        if (WIDE_CHARS.has(char)) {
            t8.add(char);
            continue;
        }

        if (t8.length > 0) {
            const isKw = isKeyword(t8);
            if (isKw) {
                if (t8.compare(CHAR_EX) || t8.compare(CHAR_DESC) || t8.compare(CHAR_DESCRIPTION)) {
                    skipScan = true;
                    skipSymbol = CHAR_AROBASE;
                }

                yield [TOKENS.KEYWORD, t8.currValue];
                t8.reset();
            }

            if (char === CHAR_SPACE) {
                if (t8.length > 0) {
                    t8.add(char);
                }
                continue;
            }

            if (!isKw) {
                yield [TOKENS.IDENTIFIER, t8.currValue];
                t8.reset();
            }
        }

        if (SYMBOLS.has(char)) {
            if (char === CHAR_BRACKET_OPEN) {
                skipScan = true;
                skipSymbol = CHAR_BRACKET_CLOSE;
                skipShowSymbol = true;
            }
            yield [TOKENS.SYMBOL, char];
        }
    }
}

module.exports = Object.freeze({ scan, TOKENS });
