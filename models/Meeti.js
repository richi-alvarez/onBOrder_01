const Sequelize = require('sequelize');
const db = require('../config/db');
const uuid = require('uuid/v4');
const slug = require('slug');
const shortid = require('shortid');

const Usuarios = require('../models/Usuarios');
const Grupos = require('../models/Grupos');
const Categorias = require('../models/Categorias');


const Meeti = db.define(
    'meeti', {
        id  : {
            type: Sequelize.UUID,
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
        tipo : {
            type: Sequelize.STRING,
        },
        nuevo : {
            type: Sequelize.STRING,
        },
        adicionalDescription : {
            type: Sequelize.STRING,
        },
        invitado : Sequelize.STRING,
        stock : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        iva : {
            type: Sequelize.FLOAT,
            defaultValue : 0.0
        },
        descuento : {
            type: Sequelize.FLOAT,
            defaultValue : 0.0
        },

        cupo : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        pagada : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        valorMeeti : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        zoomId : {
            type : Sequelize.TEXT
        },
        zoomPassword : {
            type : Sequelize.TEXT
        },
        epayco_customerid : {
            type : Sequelize.TEXT
        },
        epayco_secretkey : {
            type : Sequelize.TEXT
        },
        epayco_publickey : {
            type : Sequelize.TEXT
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
      
        ciudad : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una Ciudad'
                }
            }
        },        fecha : {
            type : Sequelize.DATEONLY, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una fecha para el Meeti'
                }
            }
        },
        hora : {
            type : Sequelize.TIME, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega una hora para el Meeti'
                }
            }
        },
        estado : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un estado'
                }
            }
        },
        pais : {
            type : Sequelize.STRING, 
            allowNull : false,
            validate : {
                notEmpty : {
                    msg : 'Agrega un país'
                }
            }
        },   
        imagen: Sequelize.TEXT,
        imagen1: Sequelize.TEXT,
        imagen2: Sequelize.TEXT,
        interesados : {
            type: Sequelize.INTEGER,
            defaultValue : 0
        },
        detalles : {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue : []
        }
    }, {
        hooks: {
            async beforeCreate(meeti) {
                const url = slug(meeti.titulo).toLowerCase();
                meeti.slug = `${url}-${shortid.generate()}`;
            }
        }
    } );
Meeti.belongsTo(Usuarios);
Meeti.belongsTo(Grupos);
Meeti.belongsTo(Categorias);

module.exports = Meeti;