
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


//Ocultará botón 'Exportar' e input para ingresar un nombre al fichero, mientras no se haya seleccionado un formato.
function onFormatSelect(){
  console.log("Entramos a la funcion onformatselect");
  let format = document.querySelector("#exportarTareas");
  console.log("format recuperado:",format)
  format.style.visibility="visible";
}
