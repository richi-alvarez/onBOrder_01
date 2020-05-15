const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const passport = require('./config/passport');
const router = require('./routes');

// Configuración y Modelos BD
const db = require('./config/db');
    require('./models/Usuarios');
    require('./models/Categorias');
    require('./models/Comentarios');
    require('./models/Grupos');
    require('./models/Meeti');
    require('./models/Ordenes');
    db.sync().then(() => console.log('DB Conectada')).catch((error) => console.log(error));

// Variables de Desarrollo
require('dotenv').config({path: 'variables.env'});

var messages = [{
    id:1,
    text: 'hola soy un mensaje',
    author: 'richi'
}]
// Aplicación Principal
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
io.on('connection', function(socket){
	console.log(' alguien se h conectado con socket');
	socket.emit('messagesr',messages);
	socket.on('new-message',function(data){
		messages.push(data);

		io.sockets.emit('messagesr',messages)
	});
});
// Body parser, leer formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));

// Express validator (validación con bastantes funciones)
app.use(expressValidator());

// Habilitar EJS como template engine
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Ubicación vistas
app.set('views', path.join(__dirname, './views'));

// archivos staticos
app.use(express.static('public'));

// habilitar cookie parser
app.use(cookieParser());

// crear la session
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave : false,
    saveUninitialized : false
}))

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Agrega flash messages
app.use(flash());

// Middleware (usuario logueado, flash messages, fecha actual)
app.use((req, res, next) => {
    res.locals.usuario = {...req.user} || null;
    res.locals.mensajes = req.flash();
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

// Routing
app.use('/', router());

//leer el host y puerto
const host= process.env.HOST || '0.0.0.0';
// const host= '127.0.0.2';
 const port = process.env.PORT || 5000;
//Agrega el puerto
server.listen(port,host, () => {
    console.log('El servidor esta funcionando');
});
