const Router = require('../src/router')
var router = new Router()

test('A matching route should be invoked', () => {
  var req = { url: '/one', method: 'GET' }
  var res = {}
  const mockFunction = jest.fn()
  
  router.addRoute('GET', '/one', mockFunction)
  router.route(req, res)
  expect(mockFunction.mock.calls.length).toBe(1)
})

test('The httpMethod should be a non-empty string', () => {
  const mockFunction = jest.fn()
  
  expect(() => router.addRoute()).toThrowError(TypeError)
  
  expect(() => router.addRoute(null, '/two', mockFunction)).toThrowError(TypeError)
  
  expect(() => router.addRoute(4, '/two', mockFunction)).toThrowError(TypeError)
})

test('All HTTP metohds should be supported', () => {
  const methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'CONNECT', 'OPTIONS', 'TRACE', 'PATCH']
  const mockFunction = jest.fn()
  
  methods.forEach(method => expect(() => router.addRoute(method, '/three', mockFunction)).not.toThrow())
})

test('An invalid httpMethod argument should throw a TypeError', () => {
  const mockFunction = jest.fn()
  
  expect(() => router.addRoute()).toThrowError(TypeError)
  expect(() => router.addRoute('BANANA', '/four', mockFunction)).toThrowError(TypeError)
})

test('The resourceURL should be a non-empty string', () => {
  const mockFunction = jest.fn()
  
  expect(() => router.addRoute('GET')).toThrowError(TypeError)
  expect(() => router.addRoute('GET', null, mockFunction)).toThrowError(TypeError)
  expect(() => router.addRoute('GET', 5, mockFunction)).toThrowError(TypeError)
})

test('The resourceURL should allow all valid characters', () => {
  const mockFunction = jest.fn()
  
  expect(() => {
    router.addRoute('GET', '/abcdefghijklmnopqrstuvwxyz/ABCDEFGHIJKLMNOPQRSTUVWXYZ/01234568/-_.~/', mockFunction)
  }).not.toThrowError()
})

test('The resourceURL should throw a TypeError for invalid characters', () => {
  const mockFunction = jest.fn()
  const reservedChars = ['!', '*', "'", ')', '(', ';', '@', '&', '=', '?', '[', ']']
  
  reservedChars.forEach((char) => {
    expect(() => router.addRoute('GET', `/${char}`, mockFunction)).toThrowError(TypeError)
  })
})

test('Colon should only follow a forward slash in the resourceURL params', () => {
  const mockFunction = jest.fn()
  
  expect(() => router.addRoute('GET', '/:foo', mockFunction)).not.toThrowError()
  expect(() => router.addRoute('GET', '/foo:', mockFunction)).toThrowError(TypeError)
})

test('The resourceURL should begin with a leading /', () => {
  const mockFunction = jest.fn()
  
  expect(() => router.addRoute('GET', 'bar', mockFunction)).toThrowError(TypeError)
  expect(() => router.addRoute('GET', '/bar', mockFunction)).not.toThrowError()
})

test('The requestHandler should be a function', () => {
  const mockFunction = jest.fn()
  var notAFunction = [undefined, null, 'foo', 5, true]
  
  notAFunction.forEach(item => expect(() => router.addRoute('GET', '/five', item)).toThrowError(TypeError))
  expect(() => router.addRoute('GET', '/five', mockFunction)).not.toThrowError()
})

test('Router should serve a 404 for unmatched routes', (done) => {
  var req = { url: '/not-a-route', method: 'GET' }
  var res = {
    setHeader: function (key, value) {},
    end: (body) => {
      expect(res.statusCode).toEqual(404)
      expect(res.statusMessage).toEqual('Not Found')
      done()
    }
  }
  
  router.route(req, res)
})

test('HTTP method should not match interchangeably', (done) => {
  var req = { url: '/inter', method: 'POST' }
  var res = {
    setHeader: function (key, value) {},
    end: (body) => {
      expect(mockFunction.mock.calls.length).toBeFalsy()
      done()
    }
  }
  const mockFunction = jest.fn((req, res) => res.end())

  router.addRoute('GET', '/inter', mockFunction)
  router.route(req, res)
})

test('The first matching route registered will be the matched route', (done) => {
  var req = { url: '/some-route', method: 'GET' }
  var res = {
    setHeader: function (key, value) {},
    end: (body) => {
      expect(firstMockFunction.mock.calls.length).toBe(1)
      done()
    }
  }
  const firstMockFunction = jest.fn((req, res) => res.end())
  const secondMockFunction = jest.fn((req, res) => res.end())
  
  router.addRoute('GET', '/some-route', firstMockFunction)
  router.addRoute('GET', '/some-route', secondMockFunction)
  router.route(req, res)
})