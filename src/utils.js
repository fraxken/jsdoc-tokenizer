/**
 * @namespace utils
 */

/**
 * @func asciiSet
 * @memberof utils#
 * @param  {Array<number | [number, number]>} plages plages
 * @returns {Set<Number>}
 */
function asciiSet(...plages) {
    const ret = new Set();
    for (const plage of plages) {
        if (typeof plage === "number") {
            ret.add(plage);
            continue;
        }

        for (let tid = plage[0]; tid < plage[1]; tid++) {
            ret.add(tid);
        }
    }

    return ret;
}

/**
 * @func stringToChar
 * @memberof utils#
 * @param {!String} str string
 * @returns {Uint8Array}
 */
function stringToChar(str) {
    return new Uint8Array([...str].map((str) => str.charCodeAt(0)));
}

module.exports = { asciiSet, stringToChar };
