const PublicRouting = require('./router/PublicRouting')
const ServerRestful = require('./server')
const dotenv = require('dotenv')

dotenv.config()

if(process.env.SERVICE === 'server') {
    const server = new ServerRestful(PublicRouting)
    server.runServer(3000)
}
