const Grupos = require('../../models/Grupos');
const Meeti = require('../../models/Meeti');
const Cart = require('../../models/Cart');
const moment = require('moment');

exports.mostrarGrupo = async (req, res, next) => {
    const consultas = [];

    consultas.push( Grupos.findOne({  where: { id: req.params.id} }) );
    consultas.push(Meeti.findAll({
                                where: { grupoId : req.params.id }, 
                                order : [
                                    ['fecha', 'ASC']
                                ]
    }));

    const [grupo, meetis] = await Promise.all(consultas);

    // si no hay grupo
    if(!grupo) {
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
    res.render('mostrar-grupo', {
        nombrePagina : `Información Grupo: ${grupo.nombre}`,
        grupo,
        meetis,
        moment,
        stocks : stock,
        totalprice: totalprice,
        alg
    });
}