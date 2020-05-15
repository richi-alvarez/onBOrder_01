const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.panelAdministracion = async (req, res) => {


    // consultas
    const consultas = [];
    consultas.push( Grupos.findAll({ where: { usuarioId : req.user.id }}) );
    consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id
                                     },
                                    order : [
                                        ['fecha', 'ASC']
                                    ] 


    }) );
    consultas.push( Meeti.findAll({ where : { usuarioId : req.user.id          
    }}) );
    // array destructuring
    const [grupos, meeti, anteriores] = await Promise.all(consultas);
    if(!req.session.cart){
        var stock = 0;
    }else{  
        var stock = req.session.cart.totalQty;
    }    if(!req.session.cart){
        var stock = 0;
    }else{  
        var stock = req.session.cart.totalQty;
    }
    res.render('administracion', {
        nombrePagina : 'Panel de Administracion', 
        grupos, 
        meeti,
        anteriores,
        moment,
        stocks : stock
    })
}