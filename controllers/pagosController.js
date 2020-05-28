const  axios = require('axios');
const Ordenes = require('../models/Ordenes');
const Meeti = require('../models/Meeti');
const Usuarios = require('../models/Usuarios');
const Cart = require('../models/Cart');
const Wish = require('../models/Wish');

exports.response= async (req, res, next) => {
    const ref_payco = req.query.ref_payco;
   
 await axios.get('https://secure.epayco.co/validation/v1/reference/' + ref_payco)
  .then(function (response) {
    // handle success
   
    const data = response.data.data;
   // console.log('data reponse',response.data.data);
        // mostramos la vista
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
        res.render('thank-you', {
          nombrePagina : `thank you Meeti`,
          data,
          stocks : stock,
        totalprice: totalprice,
        alg
      })
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

}

exports.confirmation= async (req, res, next) => {
    const response = req.body;
  var id_ = response.x_extra1.trim();
  var usuarioId_ = response.x_extra2.trim();
  var estado_ = response.x_transaction_state.trim();
    console.log("confirm data 2 =>",response.x_ref_payco )
   const orden = await Ordenes.findOne({ where : { id: id_, usuarioId : usuarioId_ }});
   if(!orden) {
    req.flash('error', 'Operación no valida');
    res.redirect('/administracion');
    return next();
}
if(estado_ === 'Aceptada'){
  orden.activo=1;
  await orden.save();
  console.log("confirm orden estado_ 3=>",estado_ )
}
    console.log("confirm orden estado_=>",estado_ )
    res.send('Has confirmado tu asistencia');
}



exports.addCart = async (req, res, next) => {
  var prodcutId = req.params.id;
  var id__ = 0;
if(req.user){
id__ = req.user.id;
}else{
  id__ = 0;
}
  var cart = new Cart(req.session.cart ? req.session.cart : {});
   const producto = await Meeti.findByPk(prodcutId);
    if(!producto){
      return res.redirect('/');
    }else{
     cart.add(producto, producto.id);
     req.session.cart = cart;
var totalprice= cart.totalPrice;
var totalcantidad= cart.totalQty;
 var alg = cart.generateArray();
     res.send({data:req.session.cart})
    }
}


exports.deleteByOneCart = async (req, res, next) => {
  var prodcutId = req.params.id;
  var id__ = 0;
if(req.user){
id__ = req.user.id;
}else{
  id__ = 0;
}
  var cart = new Cart(req.session.cart ? req.session.cart : {});
   const producto = await Meeti.findByPk(prodcutId);
    if(!producto){
      return res.redirect('/');
    }else{
     cart.reduceByOne(producto.id);
     req.session.cart = cart;
     res.send({data:req.session.cart})
    }
}

exports.deleteAllCart = async (req, res, next) => {
  var prodcutId = req.params.id;
  var id__ = 0;
if(req.user){
id__ = req.user.id;
}else{
  id__ = 0;
}
  var cart = new Cart(req.session.cart ? req.session.cart : {});
   const producto = await Meeti.findByPk(prodcutId);
    if(!producto){
      return res.redirect('/');
    }else{
     cart.removeItem(producto.id);
     req.session.cart = cart;
     res.send({data:req.session.cart})
    }
}

exports.showCart= async (req, res, next) => {

  if(!req.session.cart){
    var stock = 0;
    var totalprice = 0;
    var alg = null;
    return res.render('cart', {
      products:null,totalPrice:0, nombrePagina : 'Carrito de compras',
      stocks : stock,
      totalprice: totalprice,
      alg
    });
  }
  var cart = new Cart(req.session.cart);
console.log('__________showCart___________________')
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
  res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice,  nombrePagina : 'Carrito de compras',
  stocks : stock,
        totalprice: totalprice,
        alg});
}


exports.checkout = async (req, res, next) =>{
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
      let valorByProduct = element.qty * element.item.valorMeeti;
      var cadena = element.item.descripcion;
      var re = /<div>/g;
      var resultado = cadena.replace(re, '');
      var re2 = /div>/g;
      var resultado2 = resultado.replace(re2, '');
      var myArray = {'epayco_customerid': element.item.epayco_customerid, 'epayco_publickey': element.item.epayco_publickey, 'productoID':element.item.id};
      cars.push(myArray);
  });
}
try {
  var uderId = req.user.id;
} catch (error) {
  console.log(error)
  var uderId = null;
  next()
}

var myJSON = JSON.stringify(cars);
//console.log(":::::::::body::::::::",myJSON);
  //   res.render('checkout', {
  //       nombrePagina : 'Inicio',
  // stocks : stock,
  //       totalprice: totalprice,
  //       alg})

        res.render('checkout', {products: cart.generateArray(), totalPrice: cart.totalPrice,  nombrePagina : 'Carrito de compras',
        stocks : stock,
              totalprice: totalprice,
              alg,
              json:myJSON
            });
}



exports.addWish = async (req, res, next) => {
  var prodcutId = req.params.id;
  var id__ = 0;
if(req.user){
id__ = req.user.id;
}else{
  id__ = 0;
}
  var wish = new Wish(req.session.wish ? req.session.wish : {});
   const producto = await Meeti.findByPk(prodcutId);
    if(!producto){
      return res.redirect('/');
    }else{
      wish.add(producto, producto.id);
     req.session.wish = wish;
     res.send({data:req.session.wish})
    }
}


exports.showWishi= async (req, res, next) => {
  if(!req.session.wish){
    var stock = 0;
    var totalprice = 0;
    var alg = null;
    return res.render('deseo', {
      products:null,totalPrice:0, nombrePagina : 'lista de deseos',
      stocks : stock,
      totalprice: totalprice,
      alg
    });
  }
  var wish = new Wish(req.session.wish);
console.log('_______________addWish______________')
if(!req.session.wish){
  var stock = 0;
  var totalprice = 0;
}else{  
  if(!req.session.cart){
    var stock = 0;
    var totalprice = 0;
  }else{
    var stock = req.session.cart.totalQty;
  }
  var wish = new Wish(req.session.wish ? req.session.wish : {});
  //var totalprice= wish.totalPrice;
  var totalprice= 0;
  //var totalcantidad= wish.totalQty;
  var totalcantidad= 0;
  //var alg = wish.generateArray();
  var alg = null;
}
  res.render('deseo', {products: wish.generateArray(), totalPrice: wish.totalPrice,  nombrePagina : 'lista de deseos',
  stocks : stock,
        totalprice: totalprice,
        alg});
}


exports.pay=  (req, res, next) => {
console.log("____pay___",req.body)
var obj2 = req.body.custiId2;
var obj3 = req.body.bank;
var bank_ = req.body.banks;
//  var banks = Object.entries(obj2).forEach(([key, value]) => {
//   console.log(key + ' ' + value);   

// });
// var banks = Object.keys(obj2).map(function(key) {
//   return Object.keys(obj3).map(function(keys) {
//      return [ obj2[key], obj3[key] ];
//    });
// });

// console.log("__bank__",banks)
//CREAR TRANSACCION CON TARJETA DE CREDITO
const createPaymentPse = function(epayco,resultado2,valorByProduct){
  var pse_info = {
    //   bank: bank_,
    //  // invoice: "13213",
    //   description: resultado2,
    //   value: valorByProduct,
    //   tax: "0",
    //   tax_base: valorByProduct,
    bank: bank_,
     description: resultado2,
     value: valorByProduct.toString(),
     tax: "0",
     tax_base: valorByProduct.toString(),
      currency: "COP",
      type_person: "0",
      doc_type: "CC",
      doc_number: "10358519",
      name: 'ricardo',
      last_name: 'saldarriaga',
      email: 'ricardo.saldarriaga@payco.co',
      country: "CO",
      cell_phone: "3010000001",
      ip:"190.000.000.000", /*This is the client's IP, it is required */
      url_response: "https://ejemplo.com/respuesta.html",
      url_confirmation: "https://ejemplo.com/confirmacion",
      method_confirmation: "GET",
  }

epayco.bank.create(pse_info)
.then(function(charge) {
      console.log('SUCCESS::::::::::::::::: ',charge.data);
      pagos.push(charge.data)
      res.send({data:pagos})
})
.catch(function(err) {
    console.log("ERROR_CATCH:::::::::::::::::::::::::::::: " + err);
    pagos.push(err.data)
    res.send({data:pagos})
});


}

if(!req.session.cart){
  var stock = 0;
  var totalprice = 0;
  return res.redirect('/iniciar-sesion');
}

var stock = req.session.cart.totalQty;
var cart = new Cart(req.session.cart ? req.session.cart : {});
var totalprice= cart.totalPrice;
var totalcantidad= cart.totalQty;
var alg =  cart.generateArray();
const consultas = [];
var pagos = new Array();
alg.forEach(element => {
  var id_producto = element.item.id;
  var usuarioId=element.item.usuarioId;

var epayco_customerid = element.item.epayco_customerid;
var epayco_secretkey = element.item.epayco_secretkey;
var epayco_publickey = element.item.epayco_publickey;
var descripcion = element.item.descripcion;
var cadena = descripcion;
var re = /<div>/g;
var resultado = cadena.replace(re, '');
var re2 = /div>/g;
var resultado2 = resultado.replace(re2, '');
var valorByProduct = element.qty * element.item.valorMeeti;

var obj = req.body.custiId2;
 Object.keys(obj).map(function(key) {
  if(obj[key] == epayco_customerid){
    // console.log(":::::::::epayco_customerid::::::::",epayco_customerid);
    // console.log(":::::::::epayco_publickey::::::::",epayco_publickey);
    // console.log(":::::::::epayco_secretkey::::::::",epayco_secretkey);
     console.log(":::::::::valorByProduct::::::::", typeof(valorByProduct));
    // console.log(":::::::::descripcion::::::::",resultado2);
    // console.log(":::::::::id_producto::::::::",id_producto);
    var epayco = require('epayco-sdk-node')({
      apiKey: epayco_publickey,
      privateKey: epayco_secretkey,
      lang: 'ES',
      test: false
    });
    if(req.body.paymentType=='pse'){
 
      console.log(":::::::::pse::::::::");
    
  createPaymentPse(epayco,resultado2,valorByProduct)
 // console.log(pse_info)

    }
  }
});




});
if(req.body.paymentType=='pse'){
res.send({data:pagos})
}else{
  res.send({data:"{otra: data}"})
}
//const [  meetis  ] = await Promise.all(consultas);
// var usuarioId = meetis.usuario;
//se guarda el pedido
console.log(":::::::::valor a pagar ::::::::");




}