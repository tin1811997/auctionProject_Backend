const Sequelize = require('sequelize')

const db =new Sequelize({
    username: 'nguyentin',
    password: '123456',
    database: 'test1',
    host: '127.0.0.1',
    dialect: 'postgres',
    port: 5433,
    dialectOptions:{
        ssl:false
    },
    define:{
        freezeTableName: true
    }
})

module.exports = db