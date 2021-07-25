// Recuperar todas las fechas y añadirle la clase reminderTagThrough a las que sean inferiores a la hora actual (new Date())
let allReminderDates = document.querySelectorAll(".reminderTagText");
allReminderDates.forEach(reminderDate => {
  if(new Date(reminderDate.dataset.reminderdate) < new Date()){
    reminderDate.classList.add("reminderTagThrough");
    reminderDate.classList.remove("reminderTagText");
  }
})


function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let reminderDate = event.currentTarget.querySelector(`#reminder-date-${idTask}`).value;
  let reminderHour = event.currentTarget.querySelector(`#reminder-hour-${idTask}`).value;
  let data = {idTask, titleModified, textModified, reminderDate, reminderHour};

  //Añadir la nota al momento en el lado cliente
  let reminderTag = event.currentTarget.querySelector(`#reminderTag-${idTask}`);
  let reminderTagText = event.currentTarget.querySelector(`#reminderTagText-${idTask}`)
  let reminderTagTextSpan = event.currentTarget.querySelector(`#reminderTagTextSpan-${idTask}`)
  
  if(reminderDate && reminderHour){
    setTimeout(() => {
      let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
      reminderTag.removeAttribute("hidden");
      reminderTagTextSpan.innerText =`${setDate.toLocaleString("es-Es", {year:"numeric", month:"short",day:"numeric"})}, ${setDate.toLocaleString("es-Es", {hour: 'numeric', minute: '2-digit'})}`
    
      if(setDate<new Date()){
        reminderTagText.classList.remove("reminderTagText");
        reminderTagText.classList.add("reminderTagThrough");
      }else{
        reminderTagText.classList.remove("reminderTagThrough");
        reminderTagText.classList.add("reminderTagText");
      }
    }, 300);
  }
  
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

function updateTask(event){
  
  let idTask = event.currentTarget.dataset['idColores'];
  let SelectedbackgroundColor = event.target.style.backgroundColor;

  let tarea = document.querySelector(`#task-title-${idTask}`);
  tarea.style.backgroundColor = SelectedbackgroundColor; 

  console.log("el color de fondo es" , SelectedbackgroundColor);

let data = {idTask, SelectedbackgroundColor};

console.log("this is data value", data);

let response = fetch("/tasks/updateTaskColores", {
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