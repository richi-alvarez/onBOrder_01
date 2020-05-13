const  axios = require('axios');
const Ordenes = require('../models/Ordenes');
const Meeti = require('../models/Meeti');
const Cart = require('../models/Cart');

exports.response= async (req, res, next) => {
    const ref_payco = req.query.ref_payco;
   
 await axios.get('https://secure.epayco.co/validation/v1/reference/' + ref_payco)
  .then(function (response) {
    // handle success
   
    const data = response.data.data;
   // console.log('data reponse',response.data.data);
        // mostramos la vista
        res.render('thank-you', {
          nombrePagina : `thank you Meeti`,
          data
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
  var cart = new Cart(req.session.cart ? req.session.cart : {});
   const producto = await Meeti.findByPk(prodcutId);
    if(!producto){
      console.log(':::::::::::::::::::',err)
      return res.redirect('/');
    }else{
     cart.add(producto, producto.id);
     req.session.cart = cart;
     res.send({data:req.session.cart})
    }
}




exports.showCart= async (req, res, next) => {

  if(!req.session.cart){
    return res.render('cart', {
      products:null,totalPrice:0, nombrePagina : 'Carrito de compras'
    });
  }
  var cart = new Cart(req.session.cart);

  var alg = cart.generateArray();
  var orden_ ={};
  for (var key in alg) {
    orden_ = alg[key];
}

  res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice,  nombrePagina : 'Carrito de compras'});

}