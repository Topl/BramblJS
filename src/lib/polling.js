/**
 * @todo RA- Refactor this polling module
 * @todo RA- Simplify funcitonality & cleanup error handling
 * @todo RA- Add
 *
 * Notes:
 * Polling checks for transaction in pool,
 *  if first time it fails then it will check entire mempool
 * if it fails then it will continue to try up to the maxFailedQueries... currently set at 10 by BrambleJS
 * whenever it is found it resolves.
 *
 */

module.exports = (requests, txId, options) => {
  const {timeout, interval, maxFailedQueries} = options;
  let failureResponse;
  let numFailedQueries = 0; // initialize counter for number of queries to the mempool

  return new Promise((resolve, reject) => {
    // Setting timeout thread to clear interval thread after timeout duration
    const timeoutID = setTimeout(function() {
      clearInterval(intervalID);
      console.error("Request timed out, transaction was not included in a block before expiration: ", failureResponse);
      reject(new Error("Request timed out, transaction was not included in a block before expiration"));
    }, timeout*1000);

    const intervalID = setInterval(function() {
      requests.getTransactionById({transactionId: txId})
          .then(
              // on fulfilled promise (when the transaction has been included in a block)
              function(response) {
                try {
                // If result is non-null (transaction found) resolve the promise with json of result and stop interval and timeout threads
                  clearInterval(intervalID);
                  clearTimeout(timeoutID);
                  resolve(response.result);
                } catch (error) {
                // Catch if response cannot be parsed correctly
                  console.error("Unexepected API response from findTransactionById: ", error);
                  reject(new Error("Unexepected API response"));
                }
              },
              // on rejected promise, see if the transaction can be found in the mempool
              function(response) {
                failureResponse = response.error ? response.error.message : "Uncaught exception";
                requests.getTransactionFromMempool({transactionId: txId})
                    .then(
                        // on finding the tx in the mempool
                        function() {
                          // console.debug('Transaction Pending')
                          numFailedQueries = 0; // reset pending counter
                        },
                        // on rejected promise, increment the counter and reject if too many attepmts
                        function() {
                          // console.debug('Not found in mempool')
                          numFailedQueries++;
                          if (numFailedQueries >= maxFailedQueries) {
                            clearInterval(intervalID);
                            clearTimeout(timeoutID);
                            throw new Error("Unable to find the transaction in the mempool");
                          }
                        }
                    ).catch((err) => reject(err));
              }
          ).catch((err) => reject(err));
    }, interval*1000);
  });
};
