const express = require('express');
const app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
console.log('cart char')
var messages = [{
    id:1,
    text: 'hola soy un mensaje',
    author: 'richi'
}]

    io.on('connection', function(socket){
        console.log(' alguien se h conectado con socket');
        socket.emit('messagesr',messages);
        socket.on('new-message',function(data){
            messages.push(data);
    
            io.sockets.emit('messagesr',messages)
        });
    });

