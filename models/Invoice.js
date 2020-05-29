const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/Usuarios');
const Invoice = db.define(
    'invoice', {
        id  : {
            type: Sequelize.UUID,
            primaryKey : true,
            allowNull : false
        }, 
        ref_payco : {
            type : Sequelize.INTEGER,
        }, 
        factura : {
            type: Sequelize.STRING,
        },
        descripcion : {
            type: Sequelize.STRING,
        },
        valor : {
            type: Sequelize.INTEGER,
        },
        iva : {
            type: Sequelize.INTEGER,
        },
        baseiva : Sequelize.INTEGER,
        moneda : {
            type: Sequelize.STRING,
        },
        estado : {
            type: Sequelize.STRING,
        },
        nombres : {
            type: Sequelize.STRING,
        },
        appelidos : {
            type : Sequelize.STRING
        },
        email : {
            type : Sequelize.STRING
        },
        ciudad : {
            type : Sequelize.STRING
        },
        direccion : {
            type : Sequelize.STRING
        }
    
    });

Invoice.belongsTo(Usuarios);
module.exports = Invoice;