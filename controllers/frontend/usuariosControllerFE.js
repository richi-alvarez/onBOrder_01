const Usuarios = require('../../models/Usuarios');
const Grupos = require('../../models/Grupos');
const Cart = require('../../models/Cart');

exports.mostrarUsuario = async (req, res, next) => {
    const consultas = [];

    // consultas al mismo tiempo
    consultas.push( Usuarios.findOne({ where : { id : req.params.id }}));
    consultas.push( Grupos.findAll({ where : { usuarioId : req.params.id }}) );

    const [usuario, grupos] = await Promise.all(consultas);

    if(!usuario) {
        res.redirect('/');
        return next();
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
    // mostrar la vista
    res.render('mostar-perfil', {
        nombrePagina : `Perfil Usuario: ${usuario.nombre}`,
        usuario,
        grupos,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}