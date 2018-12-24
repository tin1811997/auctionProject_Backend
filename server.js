const express = require('express')
const bodyParser = require('body-parser')
const Raven = require('raven')
const dotenv = require('dotenv')

dotenv.config() // Interacted file .env

class ServerRestful {
    constructor (PublicRouter, PrivateRouter) {
      this.server = express()
      this._publicRouter = express.Router()
      this.PublicRouter = PublicRouter
    }
  
    runServer (port) {
      // Init Error Monitoring Service
      this.initMonitoring()

      // Raven.requestHandler() must be the first middleware on the app
      this.server.use(Raven.requestHandler())

      const rawBodySaver = function (req, res, buf, encoding) {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || 'utf8')
        }
      }

      // Use Body Parser
      this.server.use(bodyParser.urlencoded({ extended: false }))
      this.server.use(bodyParser.json({ verify: rawBodySaver }))

      // Public Router run
      this.PublicRouter.forEach(({ root, router }) => {
        router.fillRouter(this._publicRouter, this._getHandlers(router)) // Loop and connect all Public Router
        this.server.use(root, this._publicRouter)
      })
  
      // Init basic root
      this._publicRouter.get('/', (req,res) => {
        res.send('Hello')
      })
      
      // Raven.errorHandler() must be before any other error middleware
      this.server.use(Raven.errorHandler())
      this.server.use(this._errorHandler)

      this.server.listen(port || Number(process.env.PORT), () => {
        console.log(`Hello, Server restful run at ${port || Number(process.env.PORT)}`)
      })
    }
  
    _getHandlers (router) {
      const handlers = router.handlers
      Object.keys(handlers).forEach((key) => {
        const fn = handlers[key]
        handlers[key] = (req, res) => res.json(fn(req, res)) // Add  (req,res) for each handler're functions
      })
      return handlers
    }

    _errorHandler (err, req, res, next) {
      const statusCode = err.statusCode || 500
      let errorMessage = ''
      const metaData = err.metaData || null

      if (req.errorType === 'InvalidParams') { // invalid body request
        errorMessage = err.message
      } else if (statusCode === 500) {
        errorMessage = _.get(err, 'response.data', undefined) || err.message
        Logger.errorStackTrace(err)
      } else {
        errorMessage = req.t(err.message)
      }

      const response = {
        errorCode: err.message,
        msg: errorMessage,
        statusCode: statusCode,
        metaData: metaData
      }

      const errToLog = err
      if (errToLog.metaData) delete errToLog.metaData
      Logger.error(errToLog)

      res.status(statusCode).json(response)
      next()
    }

    initMonitoring () {
      Raven.config(process.env.SENTRY_ENDPOINT).install()
    }
}
module.exports = ServerRestful