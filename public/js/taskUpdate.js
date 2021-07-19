function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let reminderDate = event.currentTarget.querySelector(`#reminder-date-${idTask}`).value;
  let reminderHour = event.currentTarget.querySelector(`#reminder-hour-${idTask}`).value;
  let data = {idTask, titleModified, textModified, reminderDate, reminderHour};
  
  if(!titleModified && !textModified){
    console.log("Campos text y title modified---------->",titleModified, textModified);
    //alert("Has de rellenar uno de los dos campos")
    return;
  }

      console.log("fecha:",reminderDate)
      console.log("hora:", reminderHour);

  // let reminderTag = document.querySelector(`#reminderTag-${idTask}`);
  // let reminderTagText = document.querySelector(`#reminderTagText-${idTask}`);
  // if (reminderDate && reminderHour) {
  //   reminderTag.removeAttribute('hidden');
  // }
        
  }).then(()=>{
    console.log("response:", response);
    console.log("data:", data);
  })
}