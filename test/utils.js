// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const utils = require("../src/utils");

avaTest("utils export", (assert) => {
    assert.true(is.plainObject(utils));
    assert.deepEqual(Object.keys(utils), ["asciiSet", "stringToChar"]);
});

avaTest("stringToChar", (assert) => {
    const u8 = utils.stringToChar("ho");
    assert.true(is.uint8Array(u8));
    assert.true(u8.length === 2);
    assert.true(u8.byteLength === 2);
    assert.true(u8[0] === "h".charCodeAt(0));
    assert.true(u8[1] === "o".charCodeAt(0));
});

avaTest("asciiSet", (assert) => {
    const set1 = utils.asciiSet([0, 5]);
    assert.true(is.set(set1));
    assert.deepEqual([...set1], [0, 1, 2, 3, 4, 5]);

    const set2 = utils.asciiSet("$", 95);
    assert.deepEqual([...set2], [36, 95]);
});
