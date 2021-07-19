
let allTasks = document.querySelectorAll(".reminderTagText");
allTasks.forEach( task => {
  console.log(task.innerText);
  const prueba = dayjs(task.innerText)
  task.innerText = prueba; //HAY QUE IMPLEMENTAR EL CALENDAR
})

function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let reminderDate = event.currentTarget.querySelector(`#reminder-date-${idTask}`).value;
  let reminderHour = event.currentTarget.querySelector(`#reminder-hour-${idTask}`).value;
  let data = {idTask, titleModified, textModified, reminderDate, reminderHour};
  console.log("****", event);
  // LO DE AQUI ABAJO ES PARA AÑADIR LA FECHA AL MOMENTO, HABRÍA QUE CONSTRUIRLO A MANO. No sé si es buena idea o si hacer un res.render en el post del fetch
/*   let reminderTag = document.querySelector(`#reminderTag-${idTask}`);
  let reminderTagText = event.currentTarget.querySelector(`#reminderTagText-${idTask}`)
  if(reminderDate && reminderHour){
  reminderTag.removeAttribute("hidden");
  reminderTagText.innerText = "b";
  } */
  if(!titleModified && !textModified){
    console.log("Camoos text y title modified---------->",titleModified, textModified);
    //alert("Has de rellenar uno de los dos campos")
    return;
  }
          
  let response = fetch("/tasks/updateTask", {
  method: "POST",
  body: JSON.stringify(data),
  headers:{ //es necesario
    'Content-Type': 'application/json'
  }
  }).then(()=>{
    console.log("response:", response);
    console.log("data:", data);
  })
}