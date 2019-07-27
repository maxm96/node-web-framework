const parseCookie = require('./parse-cookie')
const uuid = require('uuid')


var sessions = {}

/** @modulee memorySession
 * Middleware for creating and managing in-memory sessions.
 * Binds a sessions property to the http object that can be used
 * to access and update session data.
 * @param {http.Pair} pair
 * @returns {Promise} a promise resolving to an http.Pair
 */
module.exports = function memorySession(pair) {
  return loadCookie(pair).then(loadSession)
}

/** @function loadCookie
 * Ensures any cookie provided is parsed and loaded into the pair.req object.
 * @param {http.Pair} pair - the pair to load the cookie for
 * @returns {Promise} resolves to the modified http.Pair with the session loaded
 */
function loadCookie(pair) {
  if (pair.req.cookie)
    return Promise.resolve(pair)
  return parseCookie(pair)
}

/** @function loadSession
 * Helper function to load an in-memory session into thee http.Pair object.
 * @param {http.Pair} pair - the pair to load the session for
 * @returns {Promise} resolves to the modified http.Pair with the session loaded
 */
function loadSession(pair) {
  var sessionId = pair.req.cookie['sessionID']
  
  if (sessionId && sessions[sessionId]) {
    pair.session = sessions[sessionId]
  } else {
    sessionId = uuid()
    sessions[sessionId] = {}
    pair.session = sessions[sessionId]
    pair.res.setHeader('Set-Cookie', `sessionID=${sessionId}`)
  }
  
  return Promise.resolve(pair)
}