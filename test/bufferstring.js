// Require Third-party Dependencies
const avaTest = require("ava");
const is = require("@slimio/is");

// Require Internal Dependencies
const BufferString = require("../src/bufferstring");

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
