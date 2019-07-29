/* classes */
const HttpPair = require('./src/http-pair')
const Router = require('./src/router')
const TemplateEngine = require('./src/template-engine')
const StaticContentServer = require('./src/static-content-server')

/* middleware */
const memorySession = require('./src/memory-session')
const parseCookie = require('./src/parse-cookie')
const bodyParser = require('./src/body-parser')


module.exports = {
  HttpPair: HttpPair,
  Router: Router,
  TemplateEngine: TemplateEngine,
  StaticContentServer: StaticContentServer,
  memorySession: memorySession,
  parseCookie: parseCookie,
  bodyParser: bodyParser
}