declare module "@0gfoundation/0g-storage-ts-sdk" {
  export class Indexer {
    constructor(indexerRpc: string);
    upload(data: unknown, rpcUrl: string, signer: unknown): Promise<[unknown, unknown]>;
  }

  export class MemData {
    constructor(data: Uint8Array);
    merkleTree(): Promise<[unknown, unknown]>;
  }
}
