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
            attributes : ['slug', 'titulo', 'fecha', 'hora','imagen', 'id', 'valorMeeti','tipo', 'nuevo', 'stock', 'descuento'],

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
        var cars = new Array();
        alg.forEach(element => {
            var myArray = {'epayco_customerid': element.item.epayco_customerid, 'epayco_publickey': element.item.epayco_publickey, 'productoID':element.item.id};
            cars.push(myArray);
        });
        
    }

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
