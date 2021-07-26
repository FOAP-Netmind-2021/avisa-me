
   /*      
  Tenemos deshabilitado boton createTak.
  Comprobar que campo title o campo text contienen al menos un caracter, si es así, habilitar createTask,
  para poder crear la tarea
   */
  function validarInput() {
    let createTask = document.querySelector("#createTask");
    let titulo = document.querySelector("#title");
    let texto = document.querySelector("#text");
    
    //Comprobamos que el primer caracter no sea un espacio (para evitar crear tareas vacias):
    /* let espacioInicio = false;
    let pattern = /^[ ]/;
    let espacioTitulo = pattern.test(titulo.value.charAt(0));  
    let espacioTexto = pattern.test(texto.value.charAt(0));  
         */
    let soloEspacios = false;
    let pattern = /[\x21-\x7E]/;
    let espacioTitulo = pattern.test(titulo.value);  
    let espacioTexto = pattern.test(texto.value);  

      if(espacioTitulo || espacioTexto){
       soloEspacios= false;
      }else{
       soloEspacios = true;
      } 
    //Si el titulo o el texto tienen caracteres, aparece el botón para crear tarea
    if ((titulo.value.length > 0 || texto.value.length > 0) && (!soloEspacios)) {
      createTask.style.visibility = "visible";
    }else{
      createTask.style.visibility = "hidden";
    }
  }
