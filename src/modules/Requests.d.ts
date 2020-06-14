export type BramblHeaders = {
    'Content-Type': string;
    'x-api-key': string;
};

export interface RouteInfo {
    route: string;
    method: string;
    id: string;
}

export interface Params {
    [key: string]: string | Array<string> | number | Array<number>;
}

export interface Balances extends Params {
    publicKeys: Array<string>;
}

export interface Keyfile extends Params {
    publicKey: string;
    passowrd: string;
}

export interface SignTx extends Params {
    publicKey: string;
    tx: string;
}

export interface TransferTokens extends Params {
    sender?: string | Array<string>;
    recipient: string;
    amount: number;
    fee: number;
    changeAddress?: string;
    data?: string;
}

export interface TransferAssets extends TransferTokens {
    issuer: string;
    assetCode: string;
}

export interface TransferAssetsById extends TransferAssets {
    boxId: string;
}

export interface getTransactionById extends Params {
    transactionId: string;
}

export interface GetBlockById extends Params {
    blockId: string;
}

export interface CalcDelay extends Params {
    blockId: string;
    numBlocks: number;
}
