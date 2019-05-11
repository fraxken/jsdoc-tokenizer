// Require Node.js Dependencies
const { readFileSync } = require("fs");

// Require Internal Dependencies
const { asciiSet, stringToChar, compareU8Arr } = require("./src/utils");
const jsdocKeywords = require("./src/keywords");
const BufferString = require("./src/bufferstring");

// AVAILABLE TOKENS
const TOKENS = Object.freeze({
    KEYWORD: Symbol("KEYWORD"),
    IDENTIFIER: Symbol("IDENTIFIER"),
    SYMBOL: Symbol("SYMBOL"),
    END: Symbol("ENDLINE")
});

// CONSTANTS
const CHAR_SPACE = " ".charCodeAt(0);
const CHAR_ENDLINE = "\n".charCodeAt(0);
const CHAR_EX = stringToChar("@example");
const CHAR_AROBASE = "@".charCodeAt(0);
const CHAR_STAR = "*".charCodeAt(0);
const CHAR_SLASH = "/".charCodeAt(0);

const WIDE_CHARS = asciiSet(
    [48, 57], // 0-9
    [65, 90], // a-z
    [97, 122], // A-Z
    95, 36, 39, 34, CHAR_AROBASE, ".".charCodeAt(0));

const SYMBOLS = new Set(["{", "}", "(", ")", "[", "]", "!", "?", "="].map((char) => char.charCodeAt(0)));
const KEYWORDS = jsdocKeywords.map((key) => stringToChar(key));

/**
 * @func isKeyword
 * @param {!BufferString} bufString BufferString object
 * @returns {boolean}
 */
function isKeyword(bufString) {
    for (let id = 0; id < KEYWORDS.length; id++) {
        if (bufString.compare(KEYWORDS[id])) {
            return [true, KEYWORDS[id]];
        }
    }

    return [false, null];
}

/**
 * @generator
 * @func scan
 * @param {!Buffer} buf buffer
 * @returns {IterableIterator<any>}
 */
function* scan(buf) {
    const t8 = new BufferString();
    let inExample = false;

    for (let id = 0; id < buf.length; id++) {
        const char = buf[id];
        if (inExample) {
            const isEndBlock = char === CHAR_SLASH && buf[id - 1] === CHAR_STAR;
            if (char === CHAR_AROBASE || isEndBlock) {
                inExample = false;
                const currValue = t8.currValue;
                t8.reset();
                yield [TOKENS.IDENTIFIER, currValue];
                if (isEndBlock) {
                    continue;
                }
            }

            t8.add(char);
            continue;
        }

        if (WIDE_CHARS.has(char)) {
            t8.add(char);
            continue;
        }

        if (t8.length > 0) {
            const [currIsKeyword, u8Keyword] = isKeyword(t8);
            if (currIsKeyword) {
                if (!inExample && compareU8Arr(CHAR_EX, u8Keyword)) {
                    inExample = true;
                }

                t8.reset();
                yield [TOKENS.KEYWORD, u8Keyword];
                continue;
            }

            if (char === CHAR_SPACE) {
                t8.add(char);
                continue;
            }

            const currValue = t8.currValue;
            t8.reset();
            yield [TOKENS.IDENTIFIER, currValue];
        }

        if (char === CHAR_ENDLINE) {
            yield [TOKENS.END, null];
        }

        if (SYMBOLS.has(char)) {
            yield [TOKENS.SYMBOL, char];
        }
    }
}

module.exports = { scan, TOKENS };
