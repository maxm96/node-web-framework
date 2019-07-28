const fs = require('fs')
const path = require('path')


/** @module StaticContentServer
 * Provides a class with methods to serve 
 * a resource from a specified directory.
 */
module.exports = class StaticContentServer {
  /** @constructor
   * Constructs an instance of StaticContentServer
   * using the supplied directory as the path to
   * serve requested resources.
   * @param {string} dirPath - the path to the directory to serve resources from
   */
  constructor(dirPath) {
    if (typeof dirPath !== 'string' || dirPath === '')
      throw new TypeError('The directory path must be a non-empty string')
    if (!fs.existsSync(dirPath))
      throw new Error(`The path ${dirPath} does not exist`)
    
    this.dirPath = dirPath
    this.defaultMimeType = require('./mime-types').defaultMimeType
    this.mimeTypes = require('./mime-types').mimeTypes
    
    this.serveContent = this.serveContent.bind(this)
    this.determineContentType = this.determineContentType.bind(this)
  }
  
  /** @function serveContent
   * Serves the requested resource.
   * @param {http.Pair} pair - the request and response objects
   */
  serveContent(pair) {
    var fullPath = path.join(this.dirPath, pair.req.url)
    var res = pair.res

    fs.readFile(fullPath, (err, data) => {
      if (err) {
        res.statusCode = 404
        res.statusMessage = 'Not Found'
        return res.end()
      }

      res.setHeader('Content-Length', data.length)
      res.setHeader('Content-Type', this.determineContentType(fullPath))
      
      res.end(data)
    })
  }
  
  /** @function determineContentType
   * Returns a matching mime type for a resource path.
   * @param {string} dirPath - the path to the resource
   */
  determineContentType(dirPath) {
    return this.mimeTypes[path.extname(dirPath).toLowerCase()] || this.defaultMimeType
  }
}