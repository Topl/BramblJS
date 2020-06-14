export interface pollingRequests {
    getTransactionById: (idObj: { transactionId: string }) => any;
    getTransactionFromMempool: (idObj: { transactionId: string }) => any;
}
export interface pollingOptions {
    timeout: number;
    maxFailedQueries: number;
    interval: number;
}
