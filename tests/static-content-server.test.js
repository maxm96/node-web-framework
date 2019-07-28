const StaticContentServer = require('../src/static-content-server')
const staticContentServer = new StaticContentServer('./test/resources')
const events = require('events')
const httpMocks = require('node-mocks-http')
const path = require('path')

test('The dirPath should be a non-empty string', () => {
  [undefined, null, 3, {}, ''].forEach((item) => {
    expect(() => new StaticContentServer(item)).toThrowError(TypeError)
  })
})

test('The dirPath should be a valid path', () => {
  expect(() => new StaticContentServer('./invalid/path')).toThrowError()
  expect(() => new StaticContentServer('./test/resources')).not.toThrowError()
})

test('Existing files are properly served with correct headers', (done) => {
  var req = httpMocks.createRequest({ url: 'test.txt' })
  var res = httpMocks.createResponse({ eventEmitter: events.EventEmitter })
  
  res.on('end', () => {
    expect(res.getHeader('content-type')).toEqual('text/plain')
    expect(res.getHeader('content-length')).toEqual(4)
    done()
  })
  
  staticContentServer.serveContent({ req: req, res: res })
})

test('Nested resources are properly served with correct headers', (done) => {
  var req = httpMocks.createRequest({ url: 'js/test.js'})
  var res = httpMocks.createResponse({ eventEmitter: events.EventEmitter })
  
  res.on('end', () => {
    expect(res.getHeader('content-type')).toEqual('text/javascript')
    expect(res.getHeader('content-length')).toEqual(4)
    done()
  })
  
  staticContentServer.serveContent({ req: req, res: res })
})

test('Requesting a non-existent file serves a 404', (done) => {
  var req = httpMocks.createRequest({ url: 'non/existent.wut' })
  var res = httpMocks.createResponse({ eventEmitter: events.EventEmitter })
  
  res.on('end', () => {
    expect(res.statusCode).toEqual(404)
    done()
  })
  
  staticContentServer.serveContent({ req: req, res: res })
})

test('Proper mime types are set for common file extensions', () => {
  // paths to test files keyed by expected mime type
  var paths = {
    'audio/mpeg': 'audio/test.mp3',
    'audio/wav': 'audio/test.wav',
    'text/css': 'css/test.css',
    'text/html': 'html/test.html',
    'image/gif': 'img/test.gif',
    'image/jpeg': 'img/test.jpg',
    'image/png': 'img/test.png',
    'text/javascript': 'js/test.js',
    'video/quicktime': 'video/test.mov',
    'video/mp4': 'video/test.mp4',
    'text/plain': 'test.txt'
  }
  
  Object.keys(paths).forEach((mimeType) => {
    // inspect return values from determineContentType
    expect(staticContentServer.determineContentType(
      path.join(staticContentServer.dirPath, paths[mimeType])
    )).toEqual(mimeType)
  })
})

test('Requesting a directory should serve a 404', (done) => {
  var req = httpMocks.createRequest({ url: 'audio' })
  var res = httpMocks.createResponse({ eventEmitter: events.EventEmitter })
  
  res.on('end', () => {
    expect(res.statusCode).toEqual(404)
    done()
  })
  
  staticContentServer.serveContent({ req: req, res: res })
})