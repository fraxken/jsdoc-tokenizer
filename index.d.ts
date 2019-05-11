declare namespace JSDocScanner {
    interface Tokens {
        KEYWORD: Symbol,
        IDENTIFIER: Symbol,
        SYMBOL: Symbol,
        END: Symbol
    }

    export function scan(buf: Buffer): IterableIterator<[Symbol, Uint8Array | number | null]>;
    export const TOKENS: Tokens;
}

export as namespace JSDocScanner;
export = JSDocScanner;
