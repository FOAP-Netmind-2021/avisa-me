function onFocusUpdate(event) {
    let idNote = event.currentTarget.dataset.id;
    let titleModified = event.currentTarget.querySelector(`#task-title-${idNote}`).textContent;
    let parafModified = event.currentTarget.querySelector(`#task-text-${idNote}`).textContent;
    let data = { idNote, titleModified, parafModified };

    let response = fetch("/tasks/updateTask", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { //es necesario
        'Content-Type': 'application/json'
      }
    }).then(() => {
      console.log("response:", response);
      console.log("data:", data);
    })
  }

 
  
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
