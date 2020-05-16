const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');
const Usuarios = require('../models/Usuarios');
const Meeti = require('../models/Meeti');

const Wish = db.define(
      'wish', {
        id  : {
            type: Sequelize.UUID,
            primaryKey : true,
            allowNull : false
        },
        email: {
        type: Sequelize.STRING(30)
        },
        nombre : Sequelize.STRING(60),
      });
      Wish.belongsTo(Usuarios);
      Wish.belongsTo(Meeti);

module.exports = Wish;