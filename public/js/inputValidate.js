
   /*      
  Tenemos deshabilitado boton createTak.
  Comprobar que campo title o campo text contienen al menos un caracter, si es así, habilitar createTask,
  para poder crear la tarea
   */
  function validarInput() {
    console.log("Hemos hecho click!!");
    let createTask = document.querySelector("#createTask");
    let titulo = document.querySelector("#title");
    let texto = document.querySelector("#text");
    if (titulo.value.length > 0 || texto.value.length > 0) {
      createTask.style.visibility = "visible";
    } else {
      createTask.style.visibility = "hidden";
    }
  }
