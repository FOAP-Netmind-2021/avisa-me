
let cboxHideCompletedTasks = document.querySelector("#hideCompletedTasksId");
let hideCompletedTask = false; //cuando tengamos la db configurada le pasaremos el estado por ejs para dejar como marcado o no el checkbox
let data = {hideCompletedTask:false} //Creamos esta variable global para todas las posibles futuras settings, pero ya se verá, porque podrían ser independientes
cboxHideCompletedTasks.addEventListener("change", (event)=>{
  hideCompletedTask = cboxHideCompletedTasks.checked;
  idWorkspace = document.querySelector("#hiddenId").value;
  data = {hideCompletedTask, idWorkspace}; 
  console.log(data);
  fetch("/settings/updateSettings", {
     method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` o{object}!
     headers:{
       'Content-Type': 'application/json'
    }
   }).then(res => res.json())
   .catch(error => console.error('Error:', error))
   .then(response => console.log('Success:', response));
})


/* Mostrará el botón 'Exportar' y el input 'nombre fichero', una vez se haya seleccionado un formato. */
function onFormatSelect(){
  let format = document.querySelector("#exportarTareas");
  format.style.visibility="visible";
}
