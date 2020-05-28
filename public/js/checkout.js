// Autenticación con su public_key (Requerido)
document.addEventListener('DOMContentLoaded', () => {
 
    const tc = document.querySelector('#customer-form-tc');
    if(tc) {
        tc.addEventListener('submit', pagoTc);
    }   
    const pse = document.querySelector('#customer-form-pse');
    if(pse) {
        pse.addEventListener('submit', pagoPse);
    }   
})
 
function pagoTc (event){
    debugger

    //detiene el evento automático del formulario
   
    event.preventDefault();
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
            $form.append($(`<input type="hidden" name="custiId${count}">`).val(c_i[1]));
            $form.append($(`<input type="hidden" name="epaycoToken${count}">`).val(token));
        } else {
            console.log(error.data.description)
               }
    })
    },index * interval);
    count++
    if(countTotal==count){
        setTimeout(function () {
      console.log('temrino',count)
    //  $form.get(0).submit();
        },3000)
    }
 });
 console.log('Loop finished.');
   // $form.get(0).submit();
}

function pagoPse (event){
    debugger
    event.preventDefault();
    var $form = $(this);
    var json=document.getElementById('json').value;
    var bank=document.getElementById('ccmonth').value;
    var obj = JSON.parse(json);
    typeof(obj);
    var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  var count = 0;
  var interval = 2000; 
  var countTotal = result.length;
  $form.append($(`<input type="hidden" name="banks">`).val(bank));
  result.forEach(function (el, index){
    setTimeout(function () {
    const c_i = el.map(grupo => {
        return grupo.epayco_customerid
        });
        $form.append($(`<input type="hidden" name="bank">`).val(bank));
        $form.append($(`<input type="hidden" name="custiId${count}">`).val(c_i[1]));
        console.log(c_i);
    },index * interval);
    count++

    if(countTotal==count){
        setTimeout(function () {
      console.log('temrino',count)
      $form.get(0).submit();
        },3000)
    }
  });
 

    //$form.get(0).submit();
}