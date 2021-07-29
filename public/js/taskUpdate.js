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
  let data = {idTask, titleModified, textModified};

  // Si el título Y el texto de la nota no cumple con el patrón, retornamos. 
  // Se hace de esta manera porque el update devuelve espacios en blanco extra.
  if(!/\S/.test(titleModified) && !/\S/.test(textModified)) return;
          
  fetch("/tasks/updateTask", {
      method: "POST",
      body: JSON.stringify(data),
      headers:{ //es necesario
        'Content-Type': 'application/json'
      }
  })
}

function updateTask(event){
  
  let idTask = event.currentTarget.dataset['idColores'];
  let SelectedbackgroundColor = event.target.style.backgroundColor;

  let tarea = document.querySelector(`#task-title-${idTask}`);
  tarea.style.backgroundColor = SelectedbackgroundColor; 

  let data = {idTask, SelectedbackgroundColor};

  fetch("/tasks/updateTaskColores", {
      method: "POST",
      body: JSON.stringify(data),
      headers:{ //es necesario
        'Content-Type': 'application/json'
      }
  })
}

function updateReminderDate(event){
  let idTask = event.currentTarget.dataset.datetime; 
  let reminderDate = event.currentTarget.querySelector(`#reminder-date-${idTask}`).value;
  let reminderHour = event.currentTarget.querySelector(`#reminder-hour-${idTask}`).value;
  let reminderTag = document.querySelector(`#reminderTag-${idTask}`);
  let reminderTagText = document.querySelector(`#reminderTagText-${idTask}`)
  let reminderTagTextSpan = document.querySelector(`#reminderTagTextSpan-${idTask}`)
  let deleteReminder = document.querySelector(`#deleteReminder-${idTask}`)

  let data = {idTask, reminderDate, reminderHour};
  if(reminderDate && reminderHour){
    setTimeout(() => {
      let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
      reminderTag.removeAttribute("hidden");

      reminderTagTextSpan.innerText =`${setDate.toLocaleString("es-Es", {year:"numeric", month:"short",day:"numeric"})}, ${setDate.toLocaleString("es-Es", {hour: 'numeric', minute: '2-digit'})}`
      deleteReminder.removeAttribute("hidden");

      if(setDate<new Date()){
        reminderTagText.classList.remove("reminderTagText");
        reminderTagText.classList.add("reminderTagThrough");
      }else{
        reminderTagText.classList.remove("reminderTagThrough");
        reminderTagText.classList.add("reminderTagText");
      }
    }, 300);

    fetch("/tasks/updateReminderDate", {
        method: "POST",
        body: JSON.stringify(data),
        headers:{ //es necesario
          'Content-Type': 'application/json'
        }
    })
  }

}

function deleteReminderDate(event){

  let idTask = event.target.parentNode.dataset.id; 
  let data = {idTask};
  let reminderTag = document.querySelector(`#reminderTag-${idTask}`);

  fetch("/tasks/deleteReminderDate", {
      method: "POST",
      body: JSON.stringify(data),
      headers:{ //es necesario
        'Content-Type': 'application/json'
      }
  })
    .then(()=>{
        setTimeout(() => {
          reminderTag.hidden = true;
          }, 300);
    })
}

