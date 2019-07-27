const bodyParser = require('../src/body-parser')
var httpMocks = require('node-mocks-http')

test('application/x-www-form-urlencoded is parsed correctly', (done) => {
  // create request and response mocks
  var req = httpMocks.createRequest({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  var res = httpMocks.createResponse()
  
  bodyParser({ req: req, res: res }).then((pair) => {
    // expected body: { foo: 'bar', baz: ['foo', 'bar'] }
    expect(pair.req.body.foo).toEqual('bar')
    expect(pair.req.body.baz).toEqual(expect.arrayContaining(['foo', 'bar']))
    done()
  })
  
  // send mock request
  req.send('foo=bar&baz=foo&baz=bar')
})

test('multipart/form-data is parsed correctly', (done) => {
  const multipartBoundary = 'someboundary' // request boundary
  var req = httpMocks.createRequest({
    headers: { 
      'Content-Type': `multipart/form-data; boundary=${multipartBoundary}`,
    }
  })
  var res = httpMocks.createResponse()
  
  bodyParser({ req: req, res: res }).then((pair) => {
    expect(pair.req.body.foo).toEqual('bar')
    done()
  })
  
  req.send(`--${multipartBoundary}\r\nContent-Disposition: form-data; name=\"foo\"\r\n\r\nbar\r\n--${multipartBoundary}--`)
})