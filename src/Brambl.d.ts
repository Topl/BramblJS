import KeyManager from './modules/KeyManager';
import KeyManagerTypes from './modules/KeyManager';
import Requests from './modules/Requests';
import RequestsTypes from './modules/Requests';

export interface KeyManagerInit extends KeyManagerTypes.ConstructorParams {
    instance?: KeyManager;
}

export interface RequestsInit extends RequestsTypes.BramblHeaders {
    instance?: Requests;
}

export interface Params {
    KeyManager: KeyManagerInit;
    Requests: RequestsInit;
}

export interface PrototypeTx {
    formattedTx: Record<string, unknown>;
    messageToSign: string;
}

export interface Options {
    interval: number;
    timeout: number;
    maxFailedQueries: number;
}
