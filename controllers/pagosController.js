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
        if(!req.session.cart){
          var stock = 0;
        }else{  
          var stock = req.session.cart.totalQty;
        }
        res.render('thank-you', {
          nombrePagina : `thank you Meeti`,
          data,
          stocks : stock
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
    return res.render('cart', {
      products:null,totalPrice:0, nombrePagina : 'Carrito de compras',
      stocks : stock
    });
  }
  var cart = new Cart(req.session.cart);


console.log('_____________________________')
if(!req.session.cart){
  var stock = 0;
}else{  
  var stock = req.session.cart.totalQty;
}
  res.render('cart', {products: cart.generateArray(), totalPrice: cart.totalPrice,  nombrePagina : 'Carrito de compras',
  stocks : stock});

}


exports.checkout = async (req, res, next) =>{
  if(!req.session.cart){
  var stock = 0;
}else{  
  var stock = req.session.cart.totalQty;
}
    res.render('checkout', {
        nombrePagina : 'Inicio',
  stocks : stock})
}