const url = require('url')


/** @module Router
 * Provides a class Router that registers
 * mappings from routes to a request handler
 * function, and can apply these routes,
 * invoking the registered request handler.
 */
module.exports = class Router {
  /** @constructor
   * Contructs a new instance of Router
   */
  constructor() {
    this.routes = {
      'GET': [],
      'HEAD': [],
      'POST': [],
      'PUT': [],
      'DELETE': [],
      'CONNECT': [],
      'OPTIONS': [],
      'TRACE': [],
      'PATCH': [],
    }
    
    // bind instance methods
    this.addRoute = this.addRoute.bind(this)
    this.route = this.route.bind(this)
  }
  
  /** @method addRoute
   * Adds a route to the router that can later 
   * be matched with the route() method.
   * @param {string} httpMethod - a valid HTTP method (GET, POST, ...).
   * @param {string} resourceURL - the resource path as a valid URL with
   * the possibility of wildcard symbols starting with : (i.e. fruits/:id 
   * matches with fruits/apple). The first matching route registered is the one
   * that will be used. Routes with an all matching wildcard (i.e. /:foo, /:foo/:bar) will
   * be matched last.
   * @param {function} requestHandler - a function to invoke on a successful match.
   * @throws {TypeError} when the requirements of an argument are not sastisfied.
   */
  addRoute(httpMethod, resourceURL, requestHandler) {
    if (typeof httpMethod !== 'string')
      throw new TypeError('httpMethod must be a string')
    if (!this.routes[httpMethod])
      throw new TypeError('httpMethod must be a valid HTTP method')
    
    if (typeof resourceURL !== 'string')
      throw new TypeError('resourceURL must be a string')
    if (resourceURL.charAt(0) !== '/')
      throw new TypeError('resourceURL must begin with a /')
    if (/[!\*'\(\);@&=\?\[\]]/.test(resourceURL))
      throw new TypeError('resourceURL cannot contain reserved characters')
    if (/[^\/]:/.test(resourceURL))
      throw new TypeError('The character : should only appear at the start of a wildcard')
      
    if (typeof requestHandler !== 'function')
      throw new TypeError('requestHandler must be a function')
    
    // create regexp for route
    var keys = []
    var pattern = resourceURL.split('/').map((segment) => {
      if (segment.charAt(0) === ':') { // wildcards
        keys.push(segment.slice(1))
        return '([^\\/]+)'
      } else {
        return segment
      }
    }).join('\/')
    
    var route = {
      regexp: new RegExp(`^${pattern}$`),
      keys: keys,
      requestHandler: requestHandler,
    }
    
    this.routes[httpMethod].push(route)
    
    // sort routes array to put wildcard only routes in back
    this.routes[httpMethod].sort((a, b) => {
      let regexp = /^(\/:[a-zA-Z0-9]+)+$/
      let atest = regexp.test(a)
      let btest = regexp.test(b)
      
      if (atest && !btest)
        return 1
      if (!atest && btest)
        return -1
      else
        return 0
    })
  }
  
  /** @method route
   * Attempts to match the incoming request to a registered route.
   * If the route is found, its requestHandler is invoked, after any
   * route params are added to the request object. If no match is
   * found a 404 is served. The first matched route will be the one
   * that is used.
   * @param {http.incomingMessage} req - the request object
   * @param {http.serverResponse} res - the response object
   */
  route(req, res) {
    const method = req.method
    const path = url.parse(req.url).pathname
    for (var route of this.routes[method]) {
      var match = route.regexp.exec(path)
      
      if (match) {
        
        var params = {}
        route.keys.forEach((key, index) => {
          params[key] = match[index + 1]
        })
        
        req.params = params
        route.requestHandler(req, res)
        
        return
      }
    }
    
    // no matches found, serve 404
    res.statusCode = 404
    res.statusMessage = 'Not Found'
    res.end()
  }
}