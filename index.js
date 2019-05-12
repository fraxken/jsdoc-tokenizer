// Require Internal Dependencies
const { asciiSet, stringToChar, compareU8Arr } = require("./src/utils");
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
const CHAR_AROBASE = "@".charCodeAt(0);
const CHAR_STAR = "*".charCodeAt(0);
const CHAR_SLASH = "/".charCodeAt(0);
const CHAR_BRACKET_OPEN = "{".charCodeAt(0);
const CHAR_BRACKET_CLOSE = "}".charCodeAt(0);

const WIDE_CHARS = asciiSet(
    [48, 57], // 0-9
    [65, 90], // a-z
    [97, 122], // A-Z
    95, 36, 39, 34,
    "<".charCodeAt(0),
    ">".charCodeAt(0),
    CHAR_AROBASE,
    ".".charCodeAt(0)
);

const SYMBOLS = new Set(["{", "}", "(", ")", "[", "]", "!", "?", "=", ";", "\n"].map((char) => char.charCodeAt(0)));
const KEYWORDS = jsdocKeywords.map((key) => stringToChar(key));

/**
 * @func isKeyword
 * @param {!Uint8Array} u8Keyword keyword as uint8array
 * @returns {Boolean}
 */
function isKeyword(u8Keyword) {
    for (let id = 0; id < KEYWORDS.length; id++) {
        if (compareU8Arr(u8Keyword, KEYWORDS[id])) {
            return true;
        }
    }

    return false;
}

/**
 * @typedef {Object} TokenRow
 * @property {Symbol} token
 * @property {Uint8Array | number | null} value
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
            if (char === skipSymbol || (char === CHAR_SLASH && buf[id - 1] === CHAR_STAR)) {
                skipScan = false;
                const currValue = t8.currValue;
                t8.reset();
                yield [TOKENS.IDENTIFIER, currValue];

                if (skipShowSymbol) {
                    yield [TOKENS.SYMBOL, skipSymbol];
                    skipShowSymbol = false;
                }

                continue;
            }

            t8.add(char);
            continue;
        }

        if (WIDE_CHARS.has(char)) {
            t8.add(char);
            continue;
        }

        if (t8.length > 0) {
            const currValue = t8.currValue;
            const currIsKeyword = isKeyword(currValue);

            if (currIsKeyword) {
                if (compareU8Arr(CHAR_EX, currValue)) {
                    skipScan = true;
                    skipSymbol = CHAR_AROBASE;
                }

                t8.reset();
                yield [TOKENS.KEYWORD, currValue];
            }

            if (char === CHAR_SPACE) {
                if (t8.length > 0) {
                    t8.add(char);
                }
                continue;
            }

            yield [TOKENS.IDENTIFIER, currValue];
            t8.reset();
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

module.exports = { scan, TOKENS };
