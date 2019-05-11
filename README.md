# jsdoc-tokenizer
![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)

Tokenize (Scan) JSDoc buffer

## Requirements
- Node.js v10 or higher

## Getting Started

This package is available in the Node Package Repository and can be easily installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm) or [yarn](https://yarnpkg.com).

```bash
$ npm i jsdoc-tokenizer
# or
$ yarn add jsdoc-tokenizer
```

## Usage example
```js
const { scan, TOKENS } = require("jsdoc-tokenizer");

const it = scan(Buffer.from("/** @type {String} **/"));
for (const [token, value] of it) {
    if (value instanceof Uint8Array) {
        console.log(token, String.fromCharCode(...value));
    }
    else {
        const tValue = typeof value === "number" ? String.fromCharCode(value) : value;
        console.log(token, tValue);
    }
}
```

## API
### scan(buf: Buffer): IterableIterator< [Symbol, Uint8Array | number | null] >
Scan (tokenize) JSDoc block.

### TOKENS
Available tokens are:
```js
const TOKENS = Object.freeze({
    KEYWORD: Symbol("KEYWORD"),
    IDENTIFIER: Symbol("IDENTIFIER"),
    SYMBOL: Symbol("SYMBOL"),
    END: Symbol("ENDLINE")
});
```

## License
MIT
