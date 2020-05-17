const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/emails');

const Cart = require('../models/Cart');

const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

const configuracionMulter = {
    limits : { fileSize : 100000 },
    storage: fileStorage = multer.diskStorage({
        destination: (req, file, next) => {
            next(null, __dirname+'/../public/uploads/perfiles/');
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

exports.formCrearCuenta = (req, res) => {
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
    res.render('crear-cuenta', {
        nombrePagina : 'Crea tu Cuenta',
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

exports.crearNuevaCuenta = async (req, res) => {
    const usuario = req.body;

    if(!usuario.email){
        req.flash('error', 'el email es requerido!');
        res.redirect('/crear-cuenta');
    }else if(!usuario.nombre){
        req.flash('error', 'el nombre es requerido!');
        res.redirect('/crear-cuenta');
    }else if(!usuario.password){
        req.flash('error', 'el password es requerido!');
        res.redirect('/crear-cuenta');
    }

    req.checkBody('confirmar', 'El password confirmado no puede ir vacio' ).notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    // Leer los errores de express
    const erroresExpress = req.validationErrors();

if(erroresExpress){
    req.flash('error', 'El password es diferente!');
    res.redirect('/crear-cuenta');
}
    try {
        await Usuarios.create(usuario);

        // Url de confirmación
        const url = `http://${req.headers.host}/confirmar-cuenta/${usuario.email}`;

        // Enviar email de confirmación
        await enviarEmail.enviarEmail({
            usuario,
            url, 
            subject : 'Confirma tu cuenta de Meeti',
            archivo : 'confirmar-cuenta'
        });

        //Flash Message y redireccionar
        req.flash('exito', 'Hemos enviado un E-mail, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error) {
        
     if(error.errors){  
        console.log('===============================',error.parent.detail);
     req.flash('error',error.parent.detail);
      }
 
      res.redirect('/crear-cuenta');
    }
}

// Confirma la suscripción del usuario
exports.confirmarCuenta = async (req, res, next) => {
    // verificar que el usuario existe
    const usuario = await Usuarios.findOne({ where : { email: req.params.correo }});

    // sino existe, redireccionar
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/crear-cuenta');
        return next();
    }

    // si existe, confirmar suscripción y redireccionar
    usuario.activo = 1;
    await usuario.save();

    req.flash('exito', 'La cuenta se ha confirmado, ya puedes iniciar sesión');
    res.redirect('/iniciar-sesion');


}

// Formulario para iniciar sesion
exports.formIniciarSesion = (req, res) => {
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
    res.render('iniciar-sesion', {
        nombrePagina : 'Iniciar Sesión',
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

// Muestra el formulario para editar el perfil
exports.formEditarPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);
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
    res.render('editar-perfil', {
        nombrePagina : 'Editar Perfil',
        usuario,
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

// almacena en la Base de datos los cambios al perfil
exports.editarPerfil = async (req, res) => {

    const usuario = await Usuarios.findByPk(req.user.id);

    req.sanitizeBody('nombre');
    req.sanitizeBody('email');
    // leer datos del form
    const { nombre, descripcion, email} = req.body;

    // asignar los valores
    usuario.nombre = nombre;
    usuario.descripcion = descripcion;
    usuario.email = email;

    // guardar en la BD
    await usuario.save();
    req.flash('exito', 'Cambios Guardados Correctamente');
    res.redirect('/administracion');

}

// Muestra el formulario para modificar el password
exports.formCambiarPassword = (req, res) => {
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
    res.render('cambiar-password', {
        nombrePagina : 'Cambiar Password',
        stocks : stock,
        totalprice: totalprice,
        alg
    })
}

// Revisa si el password anterior es correcto y lo modifica por uno nuevo

exports.cambiarPassword = async (req, res, next) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    // verificar que el password anterior sea correcto
    if(!usuario.validarPassword(req.body.anterior)) {
        req.flash('error', 'El password actual es incorrecto');
        res.redirect('/administracion');
        return next();
    }

    // si  el password es correcto, hashear el nuevo
    const hash = usuario.hashPassword(req.body.nuevo);

    // asignar el password al usuario
    usuario.password = hash;

    // guardar en la base de datos
    await usuario.save();

    // redireccionar
    req.logout();
    req.flash('exito', 'Password Modificado Correctamente, vuelve a iniciar sesión');
    res.redirect('/iniciar-sesion');
}

// Muestra el formulario para subir una imagen de perfil
exports.formSubirImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);
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
    res.render('imagen-perfil', {
        nombrePagina : 'Subir Imagen perfil',
        usuario,
        stocks : stock,
        totalprice: totalprice,
        alg
    });

}


// Guarda la imagen nueva, elimina la anterior ( si aplica ) y guarda el registro en la BD
exports.guardarImagenPerfil = async (req, res) => {
    const usuario = await Usuarios.findByPk(req.user.id);

    // si hay imagen anterior, eliminarla
    if(req.file && usuario.imagen) {
        const imagenAnteriorPath = __dirname + `/../public/uploads/perfiles/${usuario.imagen}`;

        // eliminar archivo con filesystem
        fs.unlink(imagenAnteriorPath, (error) => {
            if(error) {
                console.log(error);
            }
            return;
        })
    }

    // almacenar la nueva imagen
    if(req.file) {
        usuario.imagen = req.file.filename;
    }

    // almacenar en la base de datos y redireccionar
    await usuario.save();
    req.flash('exito', 'Cambios Almacenados Correctamente');
    res.redirect('/administracion');
}