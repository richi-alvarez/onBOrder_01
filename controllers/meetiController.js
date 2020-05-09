const Grupos = require('../models/Grupos');
const Meeti = require('../models/Meeti');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const uuid = require('uuid/v4');
const configuracionMulter = {
    limits : { fileSize : 100000 },
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

const upload = multer(configuracionMulter).single('imagen');

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
    const grupos = await Grupos.findAll({ where : { usuarioId : req.user.id }});

    res.render('nuevo-meeti', {
        nombrePagina : 'Crear Nuevo Meeti',
        grupos
    })
}
// Inserta nuevos Meeti en la BD
exports.crearMeti = async (req, res) => {
    // sanitizar    
    req.sanitizeBody('titulo');
    // obtener los datos
    const meeti = req.body;

    // asignar el usuario
    meeti.usuarioId = req.user.id;
    
       // leer la imagen
       if(req.file) {
        meeti.imagen = req.file.filename;
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
    var re = /-/g;
   // var meetZommId = meeti.zoomId.replace(re, '');
    var meetZommId = meeti.zoomId;
    meeti.zoomId=meetZommId;
    meeti.id = uuid();

    // almacenar en la BD
    try {
      await Meeti.create(meeti);
        req.flash('exito', 'Se ha creado el Meeti Correctamente');
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

    // mostramos la vista
    res.render('editar-meeti', {
        nombrePagina : `Editar Meeti : ${meeti.titulo}`,
        grupos, 
        meeti
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
var re = /-/g;
var meetZommId = zoomId.replace(re, '');

    meeti.grupoId = grupoId;
    meeti.titulo = titulo;
    meeti.invitado = invitado;
    meeti.fecha = fecha;
    meeti.hora = hora;
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
    meeti.zoomId = meetZommId;
    meeti.zoomPassword = zoomPassword;

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

    // mostrar la vista
    res.render('eliminar-meeti', {
        nombrePagina : `Eliminar Meeti : ${meeti.titulo}`
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

    req.flash('exito', 'Meeti Eliminado');
    res.redirect('/administracion');

}

// Muestra el formulario para editar una imagen de grupo
exports.formEditarImagen = async (req, res) => {
    const meeti = await Meeti.findOne({ where : { id : req.params.productoId, usuarioId : req.user.id }});

    res.render('imagen-grupo', {
        nombrePagina : `Editar Imagen producto : ${meeti.titulo}`,
        meeti
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

    // Si hay imagen anterior y nueva, significa que vamos a borrar la anterior
    if(req.file && meeti.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/productos/${meeti.imagen}`;

        // eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    // Si hay una imagen nueva, la guardamos
    if(req.file) {
        meeti.imagen = req.file.filename;
    }

    // guardar en la BD
    await meeti.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');

}