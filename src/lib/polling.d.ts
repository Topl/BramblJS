export interface pollingRequests {
    getTransactionById: (idObj: { transactionId: string }) => { [key: string]: string };
    getTransactionFromMempool: (idObj: { transactionId: string }) => { [key: string]: string };
}

export interface pollingOptions {
    timeout: number;
    maxFailedQueries: number;
    interval: number;
}
