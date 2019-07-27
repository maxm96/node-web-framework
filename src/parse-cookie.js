/** @module parseCookie
 * Parses the cookie header of an httpPair object and attaches
 * the resulting associative array of key/value pairs to the
 * httpPair.req object.
 * @param {httpPair} pair - the pair containing the request to parse
 * @returns {Promise} a promise resolving to the pair with the 
 * associative array of key/value pairs attached to pair.request.cookie
 */
module.exports = function parseCookie(pair) {
  pair.req.cookie = parseCookieString(pair.req.headers.cookie)
  return Promise.resolve(pair)
}

/** @function parseCookieString
 * Parses a cookie string and converts it to an associative array.
 * @param {string} cookieString - the cookie to parse
 * @returns {Object} the associative array of key/value pairs
 */
function parseCookieString(cookieString) {
  if (!cookieString)
    return {}
  
  var cookie = {}
  
  // cookies are key/value pairs separated by semicolons followed by space
  cookieString.split('; ').forEach((pair) => {
    // key and value is split by an equal sign
    pair = pair.split('=')
    var key = pair[0]
    var value = decodeURIComponent(pair[1]) // values are uri encoded
    
    cookie[key] = value
  })
  
  return cookie
}