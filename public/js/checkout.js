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
    //debugger

    //detiene el evento automático del formulario
   
    event.preventDefault();
    //captura el contenido del formulario
    var $form = $(this);
    var numero_documento=document.getElementById('p_k').value;
    var json=document.getElementById('json').value;

    var obj = JSON.parse(json);
typeof(obj);
var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  
 // console.log(result);
 var count = 0;
 var interval = 2000; 
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
 });
 console.log('Loop finished.');
   // $form.get(0).submit();
}

function pagoPse (event){
    debugger
    event.preventDefault();
    var $form = $(this);
    var numero_documento=document.getElementById('p_k').value;
    $form.get(0).submit();
}