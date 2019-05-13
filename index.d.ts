declare namespace JSDocScanner {
    interface Tokens {
        KEYWORD: Symbol,
        IDENTIFIER: Symbol,
        SYMBOL: Symbol
    }

    export function scan(buf: Buffer): IterableIterator<[Symbol, Uint8Array | number]>;
    export const TOKENS: Tokens;
}

export as namespace JSDocScanner;
export = JSDocScanner;
