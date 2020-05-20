const Categorias = require('../models/Categorias');
const Meeti = require('../models/Meeti');
const Grupos = require('../models/Grupos');
const Usuarios = require('../models/Usuarios');
const moment = require('moment');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Cart = require('../models/Cart');
exports.home = async (req, res) => {

    // Promise para consultas en el home
    const consultas = [];
    consultas.push( Categorias.findAll({}) );
    consultas.push( Meeti.findAll ({
            attributes : ['slug', 'titulo', 'fecha', 'hora','imagen', 'id', 'valorMeeti'],

           // limit: 3,
            order : [
                ['fecha', 'ASC']
            ], 
            include : [
                {
                    model : Grupos, 
                    attributes: ['id']
                },
                {
                    model : Usuarios, 
                    attributes: ['nombre', 'imagen']
                }
            ]
    }));

    // extraer y pasar a la vista
    const [ categorias, meetis  ] = await Promise.all(consultas);
    if(!req.session.cart){
        var stock = 0;
        var totalprice = 0;
    }else{  
        var stock = req.session.cart.totalQty;
         var cart = new Cart(req.session.cart ? req.session.cart : {});
         var totalprice= cart.totalPrice;
        var totalcantidad= cart.totalQty;
        var alg = cart.generateArray();
        alg.forEach(element => {
            console.log("::::: id producto :::: ",element.item.id);
            console.log("::::: epayco_customerid: :::: ",element.item.epayco_customerid);
            console.log("::::: epayco_secretkey: :::: ",element.item.epayco_secretkey);
            console.log("::::: descripcion::: :::: ",element.item.descripcion);
            let valorByProduct = element.qty * element.item.valorMeeti;
            console.log(":::::::::valor a pagar ::::::::",valorByProduct);
            console.log(":::::::::body::::::::",element);
            var cadena = element.item.descripcion;
            var re = /<div>/g;
            var resultado = cadena.replace(re, '');
            var re2 = /div>/g;
            var resultado2 = resultado.replace(re2, '');
          
        });
        
    }
    
    
  //  console.log(":::::::::body::::::::",res.locals.usuario,req.user.id)

    res.render('home', {
        nombrePagina : 'Inicio',
        categorias, 
        meetis, 
        moment,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
};
