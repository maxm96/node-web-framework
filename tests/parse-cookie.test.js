const parseCookie = require('../src/parse-cookie')

test('parseCookie should attach an empty object when there are no cookies', (done) => {
  var pair = {
    req: { headers: {} },
    res: {}
  }
  
  parseCookie(pair).then((pair) => {
    expect(pair.req.cookie).toEqual({})
    done()
  })
})

test('parseCookie should parse a single value from a cookie', (done) => {
  var pair = {
    req: {
      headers: { cookie: 'foo=bar' }
    },
    res: {}
  }
  
  parseCookie(pair).then((pair) => {
    expect(pair.req.cookie['foo']).toEqual('bar')
    done()
  })
})

test('parseCookie should parse multiple values from a cookie', (done) => {
  var pair = {
    req: {
      headers: { cookie: 'a=1; b=2; c=3' }
    },
    res: {}
  }
  
  parseCookie(pair).then((pair) => {
    expect(pair.req.cookie['a']).toEqual('1')
    expect(pair.req.cookie['b']).toEqual('2')
    expect(pair.req.cookie['c']).toEqual('3')
    done()
  })
})