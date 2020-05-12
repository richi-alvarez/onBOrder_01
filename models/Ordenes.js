const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');

const Usuarios = require('../models/Usuarios');
const Meeti = require('../models/Meeti');


const Ordenes = db.define(
    'orden', {
        id  : {
            type: Sequelize.STRING,
            primaryKey : true,
            allowNull : false
        }, 
        titulo : {
            type : Sequelize.STRING,
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un Titulo'
                }
            }
        }, 
        slug : {
            type: Sequelize.STRING,
        },
        activo : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        descripcion : {
            type : Sequelize.TEXT, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una descripción'
                }
            }
        },

    }, {
        hooks: {
            async beforeCreate(orden) {
                const url = slug(orden.titulo).toLowerCase();
                orden.slug = `${url}-${shortid.generate()}`;
            }
        }
    } );
    Ordenes.belongsTo(Usuarios);
    Ordenes.belongsTo(Meeti);

module.exports = Ordenes;