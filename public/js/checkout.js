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
    var numero_documento=document.getElementById('p_k').value;
    var json=document.getElementById('json').value;

    var obj = JSON.parse(json);
typeof(obj);
var result = Object.keys(obj).map(function(key) {
    return [Number(key), obj[key]];
  });
  
 // console.log(result);
 var count = 0;
  result.forEach(element => {
      console.log("count", count);
        element.map(grupo => {
                console.log(grupo)
            ePayco.setPublicKey(grupo.epayco_publickey);
            ePayco.token.create($form, function(error, token) {
                if(!error) {
                    console.log("token=>",token)
                    //si la petición es correcta agrega un input "hidden" con el token como valor
                    $form.append($(`<input type="hidden" name="custiId${count}">`).val(grupo.epayco_customerid));
                    $form.append($(`<input type="hidden" name="epaycoToken${count}">`).val(token));
                    //envia el formulario para que sea procesado
                } else {
                    console.log(error.data.description)
                    //muestra errores que hayan sucedido en la transacción
                }
            });
        });
        count++
    });

   // $form.get(0).submit();
    // const p_k = result.map(data => {
    //     return data.epayco_publickey
    // });
    // console.log(p_k);
  

}

function pagoPse (event){
    debugger
    event.preventDefault();
    var $form = $(this);
    var numero_documento=document.getElementById('p_k').value;
    $form.get(0).submit();
}