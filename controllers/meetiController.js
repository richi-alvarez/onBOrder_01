const Grupos = require('../models/Grupos');
const Categorias = require('../models/Categorias');
const Meeti = require('../models/Meeti');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');
const Cart = require('../models/Cart');

const uuid = require('uuid/v4');
const configuracionMulter = {
   // limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/productos/');
        },
        filename : (req, file, next) => {
            const extension = file.mimetype.split('/')[1];
            next(null, `${shortid.generate()}.${extension}`);
        }
    }), 
    fileFilter(req, file, next) {
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            //el formato es valido
            next(null, true);
        } else {
            // el formato no es valido
            next(new Error('Formato no válido'), false);
        }
    }
}

// const upload = multer(configuracionMulter).single('imagen');
//var storage = multer.diskStorage({})

const upload = multer(configuracionMulter).array("imagen", 12);

// sube imagen en el servidor
exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                if(error.code === 'LIMIT_FILE_SIZE') {
                    req.flash('error', 'El Archivo es muy grande')
                } else {
                    req.flash('error', error.message);
                }
            } else if(error.hasOwnProperty('message')) {
                req.flash('error', error.message);
            }
            res.redirect('back');
            return;
        } else {
            next();
        }
    })
}



// Muestra el formulario para nuevos Meeti
exports.formNuevoMeeti = async (req, res) => {
    const grupos = await Grupos.findAll({ where : { usuarioId : req.user.id }
    });
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

    res.render('nuevo-meeti', {
        nombrePagina : 'Crear Nuevo Producto',
        grupos,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}
// Inserta nuevos Meeti en la BD
exports.crearMeti = async (req, res) => {
    // sanitizar    
    req.sanitizeBody('titulo');
    req.sanitizeBody('zoomId');
    req.sanitizeBody('zoomPassword');
    // obtener los datos
    const meeti = req.body;
    const grupoIda =req.body.grupoId;
   function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
}
function formatH(){
    var d = new Date(),
    minutes = d.getMinutes(),
    hours = d.getHours();
    return [hours, minutes].join(':');
}

   var ts = new Date();
   var formatoFecha= formatDate(ts.toDateString());
   var formatHours = formatH();
   
   var ivatotal;
   var iva;
   var amount;
   var totalAmount;
    var totalDecuento;
   if(req.body.descuento){
    totalDecuento=req.body.descuento;
       if(req.body.valorMeeti>req.body.descuento){
    amount= req.body.valorMeeti;
    totalAmount= amount-req.body.descuento;
   }else{
    totalAmount=req.body.descuento;
   }
}else{
    totalAmount= req.body.valorMeeti;
    totalDecuento=0;
}
   if(req.body.iva){
    iva = req.body.iva;
    ivatotal= (19*totalAmount)/100;
  }else{
   ivatotal=0.0;
  }
  meeti.valorMeeti =totalAmount;
  meeti.iva =ivatotal;
  meeti.descuento = totalDecuento;
var tipo;
if(req.body.stock == '' && req.body.zoomId  == '')
{
    typo= 'not'
}else{
    if(req.body.stock == '' && req.body.zoomId  != '' ){
        typo= 'reunion'
        meeti.fecha= req.body.fecha;
        meeti.hora= req.body.hora;
        meeti.stock= 0;
    }else{
        if(req.body.stock != '' && req.body.zoomId  == '')
        {
            typo= 'venta'
            meeti.fecha= formatoFecha;
            meeti.hora= formatHours;
            meeti.stock= req.body.stock;
            meeti.adicionalDescription= req.body.adicionalDescription;
        }
        else{
            if(req.body.stock != '' && req.body.zoomId  != ''){
                typo = 'venta-reunion'
                meeti.stock= req.body.stock;
                meeti.adicionalDescription= req.body.adicionalDescription;
            }
        }
    }
}

meeti.tipo=typo;
var re = /-/g;
var meetZommId = meeti.zoomId.replace(re, '');
meeti.zoomId=meetZommId;
meeti.zoomPassword=req.body.zommPassword;
meeti.nuevo=req.body.productoType;

//console.log(":::::::::::::::::::::::::",req.body)
    // asignar el usuario
    meeti.usuarioId = req.user.id; 
    const consultas = [];
     consultas.push( Grupos.findAll({ where : {id :grupoIda }}) );
     // return un promise
     const [ grupos ] = await Promise.all(consultas);

    const gruposs = grupos.map(grupo => {
        return grupo.categoriaId
    });
    //console.log("================0",gruposs)
  meeti.categoriaId = gruposs;
if(req.files) {
           // leer la imagen
           var keys = [];
           for (let value of Object.values(req.files)) {
               keys.push(value.filename);
             }
      
       if(keys.length==1){
      //  console.log(":::::1:::::::::::",keys[0],keys[1],keys[2]);
        meeti.imagen=keys[0];
        meeti.imagen1=null;
        meeti.imagen2=null;
       }else{
        if(keys.length==2){
        //    console.log("::::::::2:::::::::",keys[0],keys[1],keys[2])
            meeti.imagen=keys[0];
            meeti.imagen1=keys[1];
            meeti.imagen2=null;
           }
           else{
            if(keys.length==3){
           //     console.log(":::::::3::::::::::",keys[0],keys[1],keys[2])
                meeti.imagen=keys[0];
                meeti.imagen1=keys[1];
                meeti.imagen2=keys[2];
               }else{
            //    console.log(":::::::mayor a 3::::::::::",keys[0],keys[1],keys[2])
                meeti.imagen=keys[0];
                meeti.imagen1=keys[1];
                meeti.imagen2=keys[2];
               }

           }
       }
     
   // meeti.imagen = req.file.filename;
}

    // cupo opcional
    if(req.body.cupo === '') {
        meeti.cupo = 0;
    }
    if(req.body.valorMeeti === '') {
        meeti.pagada = 0;
    }else{
        meeti.pagada = 1;
    }


    meeti.id = uuid();

    // almacenar en la BD
    try {
     //   console.log(meeti);
   await Meeti.create(meeti);
        req.flash('exito', 'cambios guardados exitosamente!');
        res.redirect('/administracion');
    } catch (error) {
        // extraer el message de los errores
        if(error.errors){  
            const erroresSequelize = error.errors.map(err => err.message);
            console.log('===============================',erroresSequelize);
          req.flash('error', erroresSequelize);
          }

        // const erroresSequelize = error.errors.map(err => err.message);
        // req.flash('error', erroresSequelize);
        res.redirect('/nuevo-meeti');
    }

}
// sanitiza los meeti
exports.sanitizarMeeti = (req, res, next) => {
    req.sanitizeBody('titulo');
    req.sanitizeBody('invitado');
    req.sanitizeBody('cupo');
    req.sanitizeBody('fecha');
    req.sanitizeBody('hora');
    req.sanitizeBody('ciudad');
    req.sanitizeBody('estado');
    req.sanitizeBody('pais');
    req.sanitizeBody('grupoId');
    req.sanitizeBody('zoomId');
    req.sanitizeBody('zoomPassword');
    next();
}

// Muestra el formulario para editar un meeti
exports.formEditarMeeti = async (req, res, next) => {
    const consultas = [];
    consultas.push( Grupos.findAll({ where : { usuarioId : req.user.id }}) );
    consultas.push( Meeti.findByPk(req.params.id) );

    // return un promise
    const [ grupos, meeti ] = await Promise.all(consultas);

    if(!grupos || !meeti ){
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
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
    // mostramos la vista
    res.render('editar-meeti', {
        nombrePagina : `Editar Producto : ${meeti.titulo}`,
        grupos, 
        meeti,
        stocks : stock,
        totalprice: totalprice,
        alg
    })

}

// almacena los cambios en el meeti (BD)
exports.editarMeeti = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where : { id: req.params.id, usuarioId : req.user.id }});

    if(!meeti) {
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
        return next();
    }

    // asignar los valores
    const { grupoId, titulo, invitado, fecha, hora, cupo,  ciudad, estado, pais,valorMeeti,epayco_customerid,epayco_secretkey, epayco_publickey,descripcion,zoomId,zoomPassword } = req.body; 
    let pagada_ =0
    console.log("__________________",valorMeeti);
if(valorMeeti){
 pagada_ = 1;
}

    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.cupo = cupo;
    meeti.pagada = pagada_;
    meeti.ciudad = ciudad;
    meeti.estado = estado;
    meeti.pais = pais;
    meeti.valorMeeti = valorMeeti;
    meeti.epayco_customerid = epayco_customerid;
    meeti.epayco_secretkey= epayco_secretkey;
    meeti.epayco_publickey = epayco_publickey;
    meeti.descripcion = descripcion;
 

   // console.log("==================",meeti);
  
   // meeti.ubicacion = point;

    // almacenar en la BD
    await meeti.save();
    req.flash('exito', 'Cambios Guardados Correctamente');
    res.redirect('/administracion');

}

// muestra un formulario para eliminar meeti's
exports.formEliminarMeeti = async ( req, res, next) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.id, usuarioId : req.user.id }});

    if(!meeti) {
        req.flash('error', 'Operación no valida');
        res.redirect('/administracion');
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
    res.render('eliminar-meeti', {
        nombrePagina : `Eliminar Prodcuto : ${meeti.titulo}`,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

// Elimina el Meeti de la BD
exports.eliminarMeeti = async (req, res) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.id, usuarioId : req.user.id }});
        // Si hay una imagen, eliminarla
        if(meeti.imagen) {
            const imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen}`;
    
            // eliminar archivo con filesystem
            fs.unlink(imagenAnteriorPath, (error) => {
                if(error) {
                    console.log(error);
                }
                return;
            });
        }

    await Meeti.destroy({
        where: {
            id: req.params.id
        }
    });

    req.flash('exito', 'Producto Eliminado');
    res.redirect('/administracion');

}

// Muestra el formulario para editar una imagen de grupo
exports.formEditarImagen = async (req, res) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.productoId, usuarioId : req.user.id }});
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
    res.render('imagen-grupo', {
        nombrePagina : `Editar Imagen producto : ${meeti.titulo}`,
        meeti,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

// Modifica la imagen en la BD y elimina la anterior
exports.editarImagen = async (req, res, next) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.productoId, usuarioId : req.user.id }});

    // el grupo existe y es válido
    if(!meeti) {
        req.flash('error', 'Operación no válida');
        res.redirect('/iniciar-sesion');
        return next();
    }
   
    if(req.files) {
        // leer la imagen
        var keys = [];
        for (let value of Object.values(req.files)) {
            keys.push(value.filename);
          }
    if(keys.length==1){
        console.log(":::::::: borar una imagen:::::::::")
     if(meeti.imagen){
        let imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen}`;
        // eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
     }
 
    }else{
        console.log("::::::::mayor a borar:::::::::",keys[0],keys[1],keys[2])
        for (var i = 1; i <= keys.length; i++) {
            if(meeti.imagen[i]){
                let imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen[i]}`;
                // eliminar archivo con filesystem
                fs.unlink(imagenAnteriorPath, (error) => {
                    if(error) {
                        console.log(error);
                    }
                    return;
                })
             }
        }
        let imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen}`;
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }
}
    // // Si hay imagen anterior y nueva, significa que vamos a borrar la anterior
    // if(req.file && meeti.imagen) {
    //     const imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen}`;
    //     // eliminar archivo con filesystem
    //     fs.unlink(imagenAnteriorPath, (error) => {
    //         if(error) {
    //             console.log(error);
    //         }
    //         return;
    //     })
    // }

    // Si hay una imagen nueva, la guardamos

    if(req.files) {
        // leer la imagen
        var keys = [];
        for (let value of Object.values(req.files)) {
            keys.push(value.filename);
          }
   
    if(keys.length==1){
     console.log(meeti.imagen,":::::1:::::::::::",keys[0],keys[1],keys[2]);
     meeti.imagen=keys[0];
     meeti.imagen1=null;
     meeti.imagen2=null;
    }else{
     if(keys.length==2){
        console.log("::::::::2:::::::::",keys[0],keys[1],keys[2])
         meeti.imagen=keys[0];
         meeti.imagen1=keys[1];
         meeti.imagen2=null;
        }
        else{
         if(keys.length==3){
            console.log(":::::::3::::::::::",keys[0],keys[1],keys[2])
             meeti.imagen=keys[0];
             meeti.imagen1=keys[1];
             meeti.imagen2=keys[2];
            }else{
           console.log(":::::::mayor a 3::::::::::",keys[0],keys[1],keys[2])
             meeti.imagen=keys[0];
             meeti.imagen1=keys[1];
             meeti.imagen2=keys[2];
            }
        }
    }
  
}
  

    // guardar en la BD
   await meeti.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');

}