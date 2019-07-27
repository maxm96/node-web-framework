const memorySession = require('../src/memory-session')

test('A session should be created if one does not exist', (done) => {
  var pair = {
    req: { headers: {} },
    res: { 
      setHeader: (key, value) => {
        if (key === 'Set-Cookie')
          expect(value).toMatch(/sessionID=[0-9a-f\-]{36}/)
      }
    }
  }
  
  memorySession(pair).then((pair) => {
    expect(pair.session).toEqual({})
    done()
  })
})

test('Invalid session ids should result in a new session', (done) => {
  var invalidSessionId = 'fb9711d6-cb5d-4161-a25b-13eab03be896'
  var pair = {
    req: {
      headers: { cookie: `sessionID=${invalidSessionId}` }
    },
    res: {
      setHeader: (key, value) => {
        if (key === 'Set-Cookie')
          expect(value).not.toMatch(invalidSessionId)
      }
    }
  }
  
  memorySession(pair).then((pair) => {
    expect(pair.session).toEqual({})
    done()
  })
})

test('Session properties should be preserved between requests', (done) => {
  var cookie
  var pair = {
    req: { headers: {} },
    res: {
      setHeader: (key, value) => {
        if (key === 'Set-Cookie')
          cookie = value
      }
    }
  }
  
  memorySession(pair).then((pair) => {
    // create session variable and a new pair
    pair.session['foo'] = 'bar'
    var pair2 = {
      req: { headers: { 'cookie': cookie } },
      res: {}
    }

    return memorySession(pair2)
  }).then((pair) => {
    expect(pair.session['foo']).toEqual('bar')
    done()
  })
})