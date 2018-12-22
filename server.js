const express = require('express')
const bodyParser = require('body-parser')

class ServerRestful {
    constructor (PublicRouter, PrivateRouter) {
      this.server = express()
      this._publicRouter = express.Router()
      this.PublicRouter = PublicRouter
    }
  
    runServer (port) {
  
      const rawBodySaver = function (req, res, buf, encoding) {
        if (buf && buf.length) {
          req.rawBody = buf.toString(encoding || 'utf8')
        }
      }
      this.server.use(bodyParser.urlencoded({ extended: false }))
      this.server.use(bodyParser.json({ verify: rawBodySaver }))

      // Public Router run
      this.PublicRouter.forEach(({ root, router }) => {
        router.fillRouter(this._publicRouter, this._getHandlers(router))
        this.server.use(root, this._publicRouter)
      })
  
      this._publicRouter.get('/', (req,res) => {
        res.send('Hello')
      })
      
      this.server.listen(port || Number(process.env.PORT), () => {
        console.log(`Hello, Server restful run at ${port || Number(process.env.PORT)}`)
      })
    }
  
    _getHandlers (router) {
      const handlers = router.handlers
      Object.keys(handlers).forEach((key) => {
        const fn = handlers[key]
        handlers[key] = (req, res) => res.json(fn(req, res))
      })
      return handlers
    }
}
module.exports = ServerRestful