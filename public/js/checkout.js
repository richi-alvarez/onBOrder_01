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
    ePayco.setPublicKey(numero_documento);
    //deshabilita el botón para no acumular peticiones
    $form.find("button").prop("disabled", true);
    //hace el llamado al servicio de tokenización
    ePayco.token.create($form, function(error, token) {
        //habilita el botón al obtener una respuesta
        $form.find("button").prop("disabled", false);
        if(!error) {
            //si la petición es correcta agrega un input "hidden" con el token como valor
            $form.append($('<input type="hidden" name="epaycoToken">').val(token));
            //envia el formulario para que sea procesado
            $form.get(0).submit();
        } else {
            console.log(error.data.description)
            //muestra errores que hayan sucedido en la transacción
            $('#error').text(error.data.description);
        }
    });

}

function pagoPse (event){
    debugger
    event.preventDefault();
    var $form = $(this);
    var numero_documento=document.getElementById('p_k').value;
    $form.get(0).submit();
}