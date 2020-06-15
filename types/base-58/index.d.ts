declare module 'base-58' {
    function decode(string: string): Uint8Array;
    function encode(buffer: Buffer | Uint8Array): string;
}
