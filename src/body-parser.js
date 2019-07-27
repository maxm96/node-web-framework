const querystring = require('querystring')


/** @module bodyParser
 * Downloads and parses the incoming request body.
 * @param {http.Pair} pair - the pair object
 * @returns {Promies} a promise that resolves to an http.Pair
 */
module.exports = function parseBody(pair) {
  return new Promise((resolve, reject) => {
    var chunks = []
    
    // collect chunks of request as they arrive
    pair.req.on('data', chunk => chunks.push(chunk))

    pair.req.on('end', () => {
      var buff = Buffer.concat(chunks)

      switch(pair.req.headers['content-type'].split(';')[0]) {
        case 'application/x-www-form-urlencoded':
          pair.req.body = querystring.parse(buff.toString())
          resolve(pair)
          break
        case 'multipart/form-data':
          try {
            var match = /boundary=(.+)$/.exec(pair.req.headers['content-type'])
            var boundary = match[1]
            
            pair.req.body = parseMultipart(buff, boundary)
            resolve(pair)
          } catch (err) {
            reject(err)
          }
          break
        case 'text/plain':
          pair.req.body = buff.toString()
          resolve(pair)
          break
        default:
          reject('Bad Request')
      }
    })

    pair.req.on('error', (err) => {
      reject(err)
    })
  })
}

/** @function parseMultipart
 * Parses a buffer using 'multipart/form-data' encoding and returns
 * it as an object of key/value pairs.
 * @param {Buffer} buffer - the buffer of multipart data
 * @param {string} boundary - the boundary bytes separating the parts
 * @returns {object} and object of key/value pairs
 */
function parseMultipart(buffer, boundary) {
  var formData = {}
  
  splitContentParts(buffer, boundary).forEach((content) => {
    var parts = parseContentPart(content)
    
    // input field is a multifile upload if we find
    // an input name that already exists in formData
    if (formData[parts[0]]) {
      // turn this index into an array and push new value
      if (!Array.isArray(formData[parts[0]])) {
        formData[parts[0]] = [formData[parts[0]]]
      }
      
      formData[parts[0]].push(parts[1])
    } else {
      formData[parts[0]] = parts[1]
    }
  })
  
  return formData
}

/** @function parseContentPart
 * @param {Buffer} content - the content part to parse
 * @returns {Array} a key/value pair as a two-element array
 */
function parseContentPart(content) {
  // 0x0D -- line end
  // 0x0A -- character feed
  const separator = Buffer.from([0x0D, 0x0A, 0x0D, 0x0A])
  var index = content.indexOf(separator)
  var head = content.slice(0, index)
  var body = content.slice(index + 4)
  
  // get name and filename fields from header
  var nameMatch = /name="([^"]+)"/.exec(head)
  var filenameMatch = /filename="([^"]+)"/.exec(head)
  
  if (filenameMatch) {
    // content is a file input field
    // try to parse a Content-Type header
    var contentTypeMatch = /Content-Type:\s?(\S+)/.exec(head)
    var contentType = contentTypeMatch && contentTypeMatch[1]
      ? contentTypeMatch[1]
      : 'application/octet-stream'
    
    // return file object as value
    return [
      nameMatch[1],
      {
        filename: filenameMatch[1],
        contentType: contentType,
        data: body,
      }
    ]
  } else {
    // content is non-file input field
    return [nameMatch[1], body.toString()]
  }
}

/** @function splitContentParts
 * Splits a multipart body into the individual content parts
 * using the supplied boundary bytes.
 * @param {Buffer} buffer - the multipart body to split
 * @param {string} boundary - the bytes that separate content
 * parts in the buffer
 * @returns {Buffer[]} the separated content parts as a buffer array
 */
function splitContentParts(buffer, boundary) {
  var parts = []
  var boundaryBytes = `--${boundary}`
  var start = buffer.indexOf(boundaryBytes) + boundaryBytes.length
  var end = buffer.indexOf(boundaryBytes, start)
  
  while (end !== -1) {
    parts.push(buffer.slice(start, end - 2)) // -2 for CLRF
    start = end + boundaryBytes.length
    end = buffer.indexOf(boundaryBytes, start)
  }
  
  return parts
}