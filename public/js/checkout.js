// Autenticación con su public_key (Requerido)
import axios from 'axios';
// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );
import jquery from 'jquery';
document.addEventListener('DOMContentLoaded', () => {
  $.getJSON("https://api.ipify.org?format=json", 
  function(data) { 
    $("#ip").html(data.ip); 
    console.log(data.ip);
});
    const tc = document.querySelector('#customer-form-tc');
    if(tc) {
        tc.addEventListener('submit', pagoTc);
    }   
    const pse = document.querySelector('#customer-form-pse');
    if(pse) {
        pse.addEventListener('submit', pagoPse);
    }   
    const cash = document.querySelector('#customer-form-cash');
    if(cash) {
        cash.addEventListener('submit', pagoCash);
    }   
})
 
function pagoTc (event){
    debugger

    //detiene el evento automático del formulario
   
    event.preventDefault();
    var newIp=$("#ip").text();
    //captura el contenido del formulario
    var $form = $(this);
    var json=document.getElementById('json').value;
 

    var obj = JSON.parse(json);
typeof(obj);
var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  
 // console.log(result);
 var count = 0;
 var interval = 2000; 
 var countTotal = result.length;
 $form.append($(`<input type="hidden" name="ip">`).val(newIp));
 result.forEach(function (el, index){
   //  console.log(el)
    setTimeout(function () {
    const p_k = el.map(grupo => {
            return grupo.epayco_publickey
    });
    const c_i = el.map(grupo => {
        return grupo.epayco_customerid
});
   // console.log(p_k[1],c_i[1]);
    ePayco.setPublicKey(p_k[1]);
    ePayco.token.create($form, function(error, token) {
        if(!error) {
            console.log("token=>",token) 
            console.log("id=>",c_i[1])   
            $form.append($(`<input type="hidden" name="custiId">`).val(c_i[1]));
            $form.append($(`<input type="hidden" name="count">`).val(count));
            $form.append($(`<input type="hidden" name="epaycoToken">`).val(token));
        } else {
            console.log(error.data.description)
               }
    })
    },index * interval);
    count++
    if(countTotal==count){
        setTimeout(function () {
      console.log('temrino',count)
      $form.get(0).submit();
        },10000)
    }
 });
 console.log('Loop finished.');
   // $form.get(0).submit();
}

function pagoPse (event){
    debugger
    event.preventDefault();
    var newIp=$("#ip").text();
    
    var $form = $(this);
    var json=document.getElementById('json').value;
    var bank=document.getElementById('ccmonth').value;
    var obj = JSON.parse(json);
    typeof(obj);
    var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  var count = 0;
  var interval = 500; 
  var countTotal = result.length;
  $form.append($(`<input type="hidden" name="banks">`).val(bank));
  $form.append($(`<input type="hidden" name="ip">`).val(newIp));
  result.forEach(function (el, index){
    setTimeout(function () {
    const c_i = el.map(grupo => {
        return grupo.epayco_customerid
        });
        $form.append($(`<input type="hidden" name="bank">`).val(bank));
        $form.append($(`<input type="hidden" name="count">`).val(count));
        $form.append($(`<input type="hidden" name="custiId">`).val(c_i[1]));
        console.log(c_i);
    },index * interval);
    count++

    if(countTotal==count){
        setTimeout(function () {
      console.log('temrino',count)
    $form.get(0).submit();
        },5000)
    }
  });
 

    //$form.get(0).submit();
}

function pagoCash (event){
  
    debugger
    var ip;
    event.preventDefault();
    var newIp=$("#ip").text();
    var $form = $(this);
    var json=document.getElementById('json').value;
    var cash;
    if(document.getElementById('baloto').checked) {
        cash = document.getElementById('baloto').value;
      }
    if(document.getElementById('puntored').checked) {
            cash = document.getElementById('puntored').value;
    }
    if(document.getElementById('efecty').checked) {
        cash = document.getElementById('efecty').value;
    }
    if(document.getElementById('gana').checked) {
        cash = document.getElementById('gana').value;
    }
    if(document.getElementById('redservi').checked) {
        cash = document.getElementById('redservi').value;
    }
    var obj = JSON.parse(json);
    typeof(obj);
    var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  var count = 0;
  var interval = 500; 
  var countTotal = result.length;
  $form.append($(`<input type="hidden" name="ip">`).val(newIp));
  result.forEach(function (el, index){
    setTimeout(function () {
    const c_i = el.map(grupo => {
        return grupo.epayco_customerid
        });
        $form.append($(`<input type="hidden" name="cash">`).val(cash));
        $form.append($(`<input type="hidden" name="count">`).val(count));
        $form.append($(`<input type="hidden" name="custiId">`).val(c_i[1]));
        console.log(c_i);
    },index * interval);
    count++

    if(countTotal==count){
        setTimeout(function () {
      console.log('temrino',count)
      if(cash){
        $form.get(0).submit();
      }else{
        alert('por favor selecciona una opcion de pago en efectivo')
      }
        },5000)
    }
  });

      
}