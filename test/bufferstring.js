// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const BufferString = require("../src/bufferstring");

avaTest("export must be a class", (assert) => {
    assert.true(is.classObject(BufferString));
    assert.is(BufferString.name, "BufferString");
    assert.is(BufferString.DEFAULT_LEN, 255);
});

avaTest("constructor property", (assert) => {
    const t8 = new BufferString();
    assert.true(is.uint8Array(t8.u8Arr));
    assert.true(t8.u8Arr.byteLength === BufferString.DEFAULT_LEN);
    assert.true(t8.currLen === 0);
});

avaTest("add a char", (assert) => {
    const t8 = new BufferString();
    const char = "a".charCodeAt(0);

    const ret = t8.add(char);
    assert.true(is.undefined(ret));
    assert.true(t8.currLen === 1);
    assert.true(t8.length === 1);
    assert.true(t8.u8Arr[0] === char);
    assert.true(t8.u8Arr[1] === 0);
});

avaTest("BufferString: re-allocate", (assert) => {
    const t8 = new BufferString();
    const len = 255;
    const elems = new Array(len + 1);

    for (let id = 0; id < len; id++) {
        elems[id] = "a";
        t8.add(97);
    }
    assert.is(t8.u8Arr.byteLength, BufferString.DEFAULT_LEN);
    elems[len + 1] = "a";
    t8.add(97);

    assert.is(t8.length, len + 1);
    assert.is(t8.u8Arr.byteLength, BufferString.DEFAULT_LEN * 2);

    const currValue = String.fromCharCode(...t8.currValue);
    assert.is(currValue, elems.join(""));
});
