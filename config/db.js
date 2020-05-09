const Sequelize = require('sequelize');
require('dotenv').config({path: 'variables.env'});

module.exports = new Sequelize(process.env.BD_NOMBRE,process.env.BD_USER, process.env.BD_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect : 'postgres', 
    pool :{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // define: {
    //     timestamps : false
    // },
    // logging : false
});