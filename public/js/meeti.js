document.addEventListener('DOMContentLoaded', () => {
    var socket = io.connect('http://localhost:5000',{ 'forceNew':true });
    socket.on('messagesr', function (data) {
        console.log(data);
        render(data)
    })
    
    function render(data){
        var htm =data.map(function(data, index){
        return	(`<div>
                <strong>${data.author}</strong>
                <em>${data.text}</em>
                </div>`)
        }).join(" "); 
        document.getElementById('messagesCHat').innerHTML = htm;
    }

    
    function addMessage(e){
        var payload = {
            author: document.getElementById('usernameChat').value,
            text: document.getElementById('textoChat').value
        };
        socket.emit('new-message',payload);
        return false;
    }



    
  const addT=document.querySelector('#addto-cart');
        if(addT) {
            asistencia.addEventListener('submit', mostrarMapa);
        }   
    
})


function mostrarMapa() {
debugger
console.log('agregar al carrito')
    // obtener los valores
 
}




