export type BramblHeaders = {
  "Content-Type": string;
  "x-api-key": string;
};

export interface Params {
  [key: string]: any;
}

export interface Balances extends Params {
  publicKeys: Array<string>;
}

export interface RouteInfo {
  route: string;
  method: string;
  id: string;
}

export interface TxParams extends Params {
  publicKey: string;
  password: string;
  tx: string;
}

export interface TransferArbitParams extends Params {
  recipient: string;
  amount: number;
  fee: number;
}

export interface txParams2 extends Params {
  tx: any;
}

export interface TransferParams extends Params {
  recipient: string;
  amount: number;
  fee: number;
  issuer: string;
  assetCode: string;
}

export interface TransferAssetsParams extends Params {
  recipient: string;
  amount: number;
  fee: number;
  issuer: string;
  assetCode: string;
  sender: Array<string>;
}

export interface TransferTargetAssetsParams extends Params {
  recipient: string;
  fee: number;
  assetId: string;
  amount: number;
}

export interface TransferTargetAssetsPrototypeParams extends Params {
  recipient: string;
  fee: number;
  assetId: string;
  amount: number;
  sender: Array<string>;
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
