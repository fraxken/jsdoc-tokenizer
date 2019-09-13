"use strict";

// CONSTANTS
const C_SPACE = " ".charCodeAt(0);

class BufferString {
    /**
     * @class BufferString
     */
    constructor() {
        this.u8Arr = new Uint8Array(BufferString.DEFAULT_LEN);
        this.currLen = 0;
    }

    /**
     * @function add
     * @memberof BufferString#
     * @param {!number} char u8 char (0-255)
     * @returns {void}
     */
    add(char) {
        // If size exceed, re-allocate a new TypedArray
        if (this.currLen === this.u8Arr.byteLength) {
            const t8 = new Uint8Array(this.u8Arr.byteLength * 2);
            t8.set(this.u8Arr);
            this.u8Arr = t8;
        }

        this.u8Arr[this.currLen] = char;
        this.currLen++;
    }

    /**
     * @function compare
     * @memberof BufferString#
     * @param {!Uint8Array} u8 Javascript Uint8Array
     * @returns {boolean}
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
     * @member {number} length
     * @memberof BufferString#
     * @returns {number}
     */
    get length() {
        return this.currLen;
    }

    /**
     * @readonly
     * @member {Buffer | null} currValue
     * @memberof BufferString#
     * @returns {Buffer}
     */
    get currValue() {
        return this.u8Arr.slice(0, this.u8Arr[this.currLen - 1] === C_SPACE ? this.currLen - 1 : this.currLen);
    }

    /**
     * @function reset
     * @memberof BufferString#
     * @returns {void}
     */
    reset() {
        this.u8Arr = new Uint8Array(BufferString.DEFAULT_LEN);
        this.currLen = 0;
    }
}

BufferString.DEFAULT_LEN = 255;

module.exports = BufferString;
