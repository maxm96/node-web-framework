/** @module httpPair
 * Converts request and response objects into a resolved promise.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 */
module.exports = function httpPair(req, res) {
  return Promise.resolve({
    req: req,
    res: res
  })
}