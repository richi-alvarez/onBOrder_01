const Meeti = require('../../models/Meeti');
const Grupos = require('../../models/Grupos');
const Usuarios = require('../../models/Usuarios');
const Cart = require('../../models/Cart');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

exports.resultadosBusqueda = async (req, res) => {
   
    // leer datos de la url 
    
    const { categoria, titulo, ciudad, pais } = req.query;

    // si la categoria esta vacia
    var query;
  console.log("categoria ===>",categoria)
    if(categoria === ''){
        query = '';
    } else {
        query = `where : {
            categoriaId : { [Op.eq] :  ${categoria}  },
        }`
    }
    console.log("query ===>",query)
    // filtrar los meetis por los terminos de busqueda
    const meetis = await Meeti.findAll({ 
        where :  { 
            titulo : { [Op.iLike] :  '%' + titulo + '%' },
            ciudad : { [Op.iLike] :  '%' + ciudad + '%' },
            pais : { [Op.iLike] :  '%' + pais + '%' }
        },
        include: [
            {
                model: Grupos, 
                query
            },
            { 
                model: Usuarios, 
                attributes : ['id',  'nombre', 'imagen']
            }
        ]
    });
    // console.log("--------------------------------",meetis)
    // pasar los resultados a la vista
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
    res.render('busqueda', {
        nombrePagina : 'Resultados Búsqueda',
        meetis, 
        moment,
        stocks : stock,
        totalprice: totalprice,
        alg
    })

}