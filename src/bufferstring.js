// COSNTANTS
const U8_LEN = 255;
const C_SPACE = " ".charCodeAt(0);

/**
 * @class BufferString
 */
class BufferString {
    /**
     * @constructor
     */
    constructor() {
        this.u8Arr = new Uint8Array(U8_LEN);
        this.currLen = 0;
    }

    /**
     * @method add
     * @memberof BufferString#
     * @param {!Number} char u8 char (0-255)
     * @returns {void}
     */
    add(char) {
        if (this.currLen === 255) {
            throw new Error("Maximum length of '255' exceed");
        }

        this.u8Arr[this.currLen] = char;
        this.currLen++;
    }

    /**
     * @method compare
     * @memberof BufferString#
     * @param {!Uint8Array} u8 Javascript Uint8Array
     * @returns {Boolean}
     */
    compare(u8) {
        if (this.currLen === 0 || this.currLen !== u8.byteLength) {
            return false;
        }

        for (let id = 0; id < this.currLen; id++) {
            if (this.u8Arr[id] !== u8[id]) {
                return false;
            }
        }

        return true;
    }

    /**
     * @readonly
     * @member {Number} length
     * @memberof BufferString#
     */
    get length() {
        return this.currLen;
    }

    /**
     * @readonly
     * @member {Buffer | null} currValue
     * @memberof BufferString#
     */
    get currValue() {
        if (this.currLen === 0) {
            return null;
        }

        const sliceLen = this.u8Arr[this.currLen - 1] === C_SPACE ? this.currLen - 1 : this.currLen;

        return this.u8Arr.slice(0, sliceLen);
    }

    /**
     * @method reset
     * @memberof BufferString#
     * @returns {void}
     */
    reset() {
        this.u8Arr = new Uint8Array(U8_LEN);
        this.currLen = 0;
    }
}

module.exports = BufferString;
