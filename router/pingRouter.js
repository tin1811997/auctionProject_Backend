const PingRouter = {
    handlers: {
      ping: (req) => {
        return {
          name: req.params.name
        }
      }
    },
  
    fillRouter: (router, handlers) => {
      router.get('/ping/:name', handlers.ping)
    }
}

module.exports = PingRouter