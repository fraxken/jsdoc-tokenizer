# jsdoc-tokenizer
![version](https://img.shields.io/badge/version-1.0.0-blue.svg)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/SlimIO/is/commit-activity)
![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)
![dep](https://img.shields.io/david/fraxken/jsdoc-tokenizer.svg)
![size](https://img.shields.io/bundlephobia/min/jsdoc-tokenizer.svg)
[![Known Vulnerabilities](https://snyk.io/test/github/fraxken/jsdoc-tokenizer/badge.svg?targetFile=package.json)](https://snyk.io/test/github/fraxken/jsdoc-tokenizer?targetFile=package.json)
[![Build Status](https://travis-ci.com/fraxken/jsdoc-tokenizer.svg?branch=master)](https://travis-ci.com/fraxken/jsdoc-tokenizer)

Tokenizer (Scanner) for JSDoc. This project only operate on/with Node.js Buffer and Uint8Array (No conversion to String required).

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
### scan(buf: Buffer): IterableIterator< [Symbol, Uint8Array | number] >
Scan (tokenize) JSDoc block. The scanner only take single instance of block (not build to detect start and end). To extract JSDoc block as buffer, please take a look at [jsdoc-extractor](https://github.com/fraxken/jsdoc-extractor).

### TOKENS
Available tokens are described by the following interface:
```ts
interface Tokens {
    KEYWORD: Symbol,
    IDENTIFIER: Symbol,
    SYMBOL: Symbol
}
```

Tokens are exported in the module.

## License
MIT
