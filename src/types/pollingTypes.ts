export interface pollingRequests {
    getTransactionById: Function;
    getTransactionFromMempool: Function;
}
export interface pollingOptions {
    timeout: number;
    maxFailedQueries: number;
    interval: number;
}
