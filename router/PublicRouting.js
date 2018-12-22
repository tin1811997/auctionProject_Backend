const PingRouter = require('./pingRouter')
const rootApi = ''

const PublicRouting = [
    { root: rootApi, router: PingRouter }
]
  
module.exports = PublicRouting