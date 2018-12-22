const PublicRouting = require('./router/PublicRouting')
const ServerRestful = require('./server')

const server = new ServerRestful(PublicRouting)
server.runServer(3000)

