const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/Usuarios');
const Meeti = require('../models/Meeti');

const Stock = db.define(
      'stock', {
        id  : {
            type: Sequelize.UUID,
            primaryKey : true,
            allowNull : false
        },
        numero : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        email: {
        type: Sequelize.STRING(30)
        },
        nombre : Sequelize.STRING(60),
      });
      Stock.belongsTo(Usuarios);
      Stock.belongsTo(Meeti);

module.exports = Stock;