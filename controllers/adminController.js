const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const Invoice = require('../models/Invoice');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cart = require('../models/Cart');

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
        var totalprice = 0;
    }else{  
        var stock = req.session.cart.totalQty;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        var totalprice= cart.totalPrice;
        var totalcantidad= cart.totalQty;
        var alg = cart.generateArray();
    }   

    res.render('administracion', {
        nombrePagina : 'Panel de Administracion', 
        grupos, 
        meeti,
        anteriores,
        moment,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

exports.facturas = async (req, res) => {
    const invoices = await Invoice.findAll({ where : { usuarioId : req.user.id }
    });
    if(!invoices){
        console.log('error')
    }
    if(!req.session.cart){
        var stock = 0;
        var totalprice = 0;
    }else{  
        var stock = req.session.cart.totalQty;
        var cart = new Cart(req.session.cart ? req.session.cart : {});
        var totalprice= cart.totalPrice;
        var totalcantidad= cart.totalQty;
        var alg = cart.generateArray();
    }  

    var usuarioId = req.user.id;
    res.render('facturas', {
        nombrePagina : 'Mis facturas', 
        stocks : stock,
        invoices,
        totalprice: totalprice,
        alg,
        usuarioId
    })
}