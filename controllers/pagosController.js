const  axios = require('axios');
const Ordenes = require('../models/Ordenes');
const Meeti = require('../models/Meeti');
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
//    console.log("confirmation",req.body)
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
      console.log(':::::::::::::::::::',err)
      return res.redirect('/');
    }else{
     cart.add(producto, producto.id);
     req.session.cart = cart;
var totalprice= cart.totalPrice;
var totalcantidad= cart.totalQty;
 var alg = cart.generateArray();
// alg.forEach(element => {
// console.log('________ id producto _______',element.item.id );
// console.log('________ titulo _______',element.item.titulo );
// console.log('________ usuario id _______',element.item.usuarioId );
// console.log('________ grupo id _______',element.item.grupoId );
// console.log('________ precio _______',element.item.valorMeeti );
// console.log('________ cantidad________',element.qty);
// console.log('_____________________________________');
// });
// console.log(totalcantidad,totalprice,'________--cart - add',id__);
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
}
    res.render('checkout', {
        nombrePagina : 'Inicio',
  stocks : stock,
        totalprice: totalprice,
        alg})
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
      console.log(':::::::::::::::::::',err)
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


exports.pay= async (req, res, next) => {
console.log("____pay___",req.body)
}