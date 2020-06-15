"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const polling = (requests, txId, options) => {
    const { timeout, interval, maxFailedQueries } = options;
    let failureResponse;
    let numFailedQueries = 0; // initialize counter for number of queries to the mempool
    return new Promise((resolve, reject) => {
        //Setting timeout thread to clear interval thread after timeout duration
        const timeoutID = setTimeout(function () {
            clearInterval(intervalID);
            reject(new Error('Request timed out, transaction was not included in a block before expiration \n' + failureResponse));
        }, timeout * 1000);
        const intervalID = setInterval(function () {
            requests
                .getTransactionById({ transactionId: txId })
                .then(
            // on fulfilled promise (when the transaction has been included in a block)
            function (response) {
                try {
                    //If result is non-null (transaction found) resolve the promise with json of result and stop interval and timeout threads
                    clearInterval(intervalID);
                    clearTimeout(timeoutID);
                    resolve(response.result);
                }
                catch (error) {
                    //Catch if response cannot be parsed correctly
                    reject('Unexepected API response from findTransactionById \n' + error);
                }
            }, 
            // on rejected promise, see if ithe transaction can be found in the mempool
            function (response) {
                failureResponse = response.error ? response.error.message : 'Uncaught exception';
                requests
                    .getTransactionFromMempool({ transactionId: txId })
                    .then(
                // on finding the tx in the mempool
                function () {
                    //console.debug('Transaction Pending')
                    numFailedQueries = 0; // reset pending counter
                }, 
                // on rejected promise, increment the counter and reject if too many attepmts
                function () {
                    //console.debug('Not found in mempool')
                    numFailedQueries++;
                    if (numFailedQueries >= maxFailedQueries) {
                        clearInterval(intervalID);
                        clearTimeout(timeoutID);
                        throw new Error('Unable to find the transaction in the mempool');
                    }
                })
                    .catch((err) => reject(err));
            })
                .catch((err) => reject(err));
        }, interval * 1000);
    });
};
exports.default = polling;
