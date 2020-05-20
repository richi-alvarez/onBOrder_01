import axios from 'axios';
// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );
import jquery from 'jquery';


document.addEventListener('DOMContentLoaded', () => {
    const asistencia = document.querySelector('#confirmar-asistencia');
    if(asistencia) {
        asistencia.addEventListener('submit', confirmarAsistencia);
    }   
    $("#snoA").fadeOut();
   
    
    const pagarEpayco=document.querySelector('#epayco')
    if(pagarEpayco) {
        pagarEpayco.addEventListener('submit', pagarWithEpayco);
    }
    const checkPago=document.querySelector('#checkPago')
    if(checkPago) {
        checkPago.addEventListener('change', checkPagos);
    }

});

function confirmarAsistencia(e) {
    e.preventDefault();

    const btn = document.querySelector('#confirmar-asistencia input[type="submit"]');
    const parent = document.getElementById('confirmar-asistencia').parentNode;
    const pago = document.querySelector('#epayco');
    let accion = document.querySelector('#accion').value;
    const mensaje = document.querySelector('#mensaje');

    // limpia la respuesta previa
    while(mensaje.firstChild) {
        mensaje.removeChild(mensaje.firstChild);
    }

    // obtiene el valor cancelar o confirmar en el hidden
    const datos = {
        accion
    }

   

    axios.post(this.action, datos)
        .then(respuesta => {
            if(accion === 'confirmar') {
                // modifica los elementos del boton
                document.querySelector('#accion').value = 'cancelar';
                btn.value = 'Cancelar';
                btn.classList.remove('flex-c-m size2');
                btn.classList.add('btn-rojo');
                
                  // mostrar un mensaje
                  
                mensaje.appendChild(document.createTextNode(respuesta.data));
                mensaje.appendChild(document.createTextNode(''));
                
             
            } else {

             

                document.querySelector('#accion').value = 'confirmar';
                btn.value = 'Si';
                btn.classList.remove('btn-rojo');
                btn.classList.add('btn-azul');
                  // mostrar un mensaje
            mensaje.appendChild(document.createTextNode(respuesta.data));
            }
        })
}

function pagarWithEpayco (e){

    debugger
    e.preventDefault();
    
  console.log('sdasd')
    let meetiId = document.getElementById('add-to-cart').value;

    const datos = {
        meetiId
    }

// console.log('click..');
//   action=> /confirmar-pago
 console.log('llego', this.action)
//axios.post(this.action, datos)
        // .then(respuesta => {
        //})
        $.ajax({
            type:"POST",
           // url:this.action,
            data:datos,
            beforeSend:function(){

            },
            success: function(datos){  
               var Datavalue = datos.llave;
                var url= window.location.origin+'/confirmation_payment';
                //console.log(url)
                var descripcionPago= datos.data.descripcion;
                var namePago= datos.data.titulo;
                var extra1P= datos.data.id;
                var extra2P= datos.data.usuario.id;
                var extra3P= datos.data.meetiId;
                
         
                $.getScript('https://checkout.epayco.co/checkout.js', function(r) {
                    var handler = ePayco.checkout.configure({
                               key: Datavalue[0].epayco_publickey,
                                test: "true"
                                 });
             
               var data = {
                amount: Datavalue[0].valorMeeti,
                country: "co",
                currency: "cop",
                description: descripcionPago,
                external: "false",
                lang: "en",
                name: namePago,
                email_billing:datos.data.usuario.email,
                name_billing: datos.data.usuario.nombre,
                tax: "0",
                tax_base: Datavalue[0].valorMeeti,
                type_doc_billing: "cc",
                extra1: extra1P,
                extra2: extra2P,
                extra3: extra3P,
                confirmation: url,
                response: url,
                            };
                           
                              handler.open(data);
                              console.log(data)
              });

              $("#snoA").fadeIn();
              closeSnoA();
           
          function closeSnoA(){
           window.setTimeout(function () {
             $("#snoA").fadeOut(500);
           }, 4000);}

            }
        })
};


function checkPagos(e){
    e.preventDefault();
    const text = document.getElementById("pagoCheck");
    var checkBox = document.getElementById("checkPago");
    if (checkBox.checked == true){
        document.getElementById("pagoCheck").style.display = "block";
        document.getElementById("valorMeeti").required = true; 
        document.getElementById("epayco_customerid").required = true; 
        document.getElementById("epayco_secretkey").required = true;
        document.getElementById("epayco_publickey").required = true;

       // text.style.display = "block";
      } else {
        document.getElementById("pagoCheck").style.display = "none";
       // text.style.display = "none";
       document.getElementById("valorMeeti").required = false;
       document.getElementById("valorMeeti").value = '';
       document.getElementById("epayco_customerid").required = false;
       document.getElementById("epayco_secretkey").required = false;
       document.getElementById("epayco_publickey").required = false;
       document.getElementById("epayco_customerid").value = '';
       document.getElementById("epayco_secretkey").value = '';
       document.getElementById("epayco_publickey").value = '';
      }
}


