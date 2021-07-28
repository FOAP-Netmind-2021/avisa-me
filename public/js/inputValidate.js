
/*      
Tenemos deshabilitado boton createTak.
Comprobar que campo title o campo text contienen al menos un caracter, si es así, habilitar createTask,
para poder crear la tarea
*/
function validarInput() {
  let createTask = document.querySelector("#createTask");
  let titulo = document.querySelector("#title");
  let texto = document.querySelector("#text");

  //Comprobamos si existen caracteres(no sólo espacios en blanco):
  let pattern = /\S/; //Encuentra cualquier carácter que NO es un espacio en blanco.
  let caracterTitulo = pattern.test(titulo.value);
  let caracterTexto = pattern.test(texto.value);

  //Si el titulo o el texto tienen caracteres y no son sólo espacios(ha pasado el test), aparece el botón para crear tarea:
  if (caracterTitulo || caracterTexto) {
    createTask.style.visibility = "visible";
  } else {
    createTask.style.visibility = "hidden";
  }
}