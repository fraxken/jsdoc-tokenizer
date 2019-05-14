// Require Third-party Dependencies
const avaTest = require("ava");

// Require Internal Dependencies
const { scan, TOKENS } = require("../");

/**
 * @func cleanStr
 * @param {!String} str str
 * @returns {String}
 */
function cleanStr(str) {
    str
        .split(/\r?\n|\r/)
        .map((str) => str.trim().normalize())
        .join("\n");
}

function assertToken(it, token, cp) {
    const { value, done } = it.next();
    if (done || value[0] !== token) {
        return false;
    }

    switch (token) {
        case TOKENS.SYMBOL:
            return cp === String.fromCharCode(value[1]);
        case TOKENS.IDENTIFIER:
        case TOKENS.KEYWORD:
            return cleanStr(cp) === cleanStr(String.fromCharCode(...value[1]));
        default:
            return false;
    }
}

avaTest("Parse JSDoc: inline @type (v1)", (assert) => {
    const buf = Buffer.from("/** @type {String} **/");
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.KEYWORD, "@type"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "{"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "String"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "}"));
    const { done } = it.next();
    assert.true(done);
});

avaTest("Parse JSDoc: inline @typedef", (assert) => {
    const buf = Buffer.from("/** @typedef {Array<number>} name **/");
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.KEYWORD, "@typedef"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "{"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "Array<number>"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "}"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "name"));
    const { done } = it.next();
    assert.true(done);
});

avaTest("Parse JSDoc: @typedef", (assert) => {
    const buf = Buffer.from(`/**
    * @const name
    * @example
    * console.log("hello world!");
    **/`);
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@const"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "name"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@example"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));

    // eslint-disable-next-line
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "* console.log(\"hello world!\");"));
    const { done } = it.next();
    assert.true(done);
});

avaTest("Parse JSDoc: @desc", (assert) => {
    const buf = Buffer.from(`/**
    * @var foo
    * @desc A multi-line
    * description
    **/`);
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@var"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "foo"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@desc"));

    // eslint-disable-next-line
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "A multi-line\n* description"));
    const { done } = it.next();
    assert.true(done);
});

avaTest("Parse JSDoc: @summary wide char", (assert) => {
    const buf = Buffer.from(`/**
    * @summary hello world!
    * @const name
    **/`);
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@summary"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "hello world!"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@const"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "name"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));

    const { done } = it.next();
    assert.true(done);
});

avaTest("Parse JSDoc: @desc end @", (assert) => {
    const buf = Buffer.from(`/**
    * @desc hello @fraxken world
    * @const name
    **/`);
    const it = scan(buf);

    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@desc"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "hello @fraxken world!"));
    assert.true(assertToken(it, TOKENS.KEYWORD, "@const"));
    assert.true(assertToken(it, TOKENS.IDENTIFIER, "name"));
    assert.true(assertToken(it, TOKENS.SYMBOL, "\n"));

    const { done } = it.next();
    assert.true(done);
});
