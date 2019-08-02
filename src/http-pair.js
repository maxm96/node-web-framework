/** @module httpPair
 * Converts request and response objects into a resolved promise.
 * @param {http.incomingMessage} req - the request object
 * @param {http.serverResponse} res - the response object
 * @param {object} options [optional] - additional options to attach to the pair
 * @returns {Promise} resolves to an object with a request object, response object
 * and any options
 */
module.exports = function httpPair(req, res, options) {
  var pair = { req: req, res: res }
  
  if (options)
    Object.assign(pair, options)
  
  return Promise.resolve(pair)
}