let months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
let reminderMonths = document.querySelectorAll("#reminderMonth");
reminderMonths.forEach( reminderMonth => {
  reminderMonth.innerText = months[parseInt(reminderMonth.innerText)];
})


function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let reminderDate = event.currentTarget.querySelector(`#reminder-date-${idTask}`).value;
  let reminderHour = event.currentTarget.querySelector(`#reminder-hour-${idTask}`).value;
  let data = {idTask, titleModified, textModified, reminderDate, reminderHour};
  console.log("****", event);

  //Añadir la nota al momento en el lado cliente
  let reminderTag = event.currentTarget.querySelector(`#reminderTag-${idTask}`);
  let reminderTagText = event.currentTarget.querySelector(`#reminderTagText-${idTask}`)
  if(reminderDate && reminderHour){
    setTimeout(() => {
      let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
      let setDateDay = setDate.getDate();
      let setDateMonth = months[parseInt(setDate.getMonth())];
      let setDateYear = setDate.getFullYear();
      let setDateHour = setDate.getHours();
      let setDateMinutes = setDate.getMinutes()<10?"0"+setDate.getMinutes():setDate.getMinutes();
      reminderTag.removeAttribute("hidden");
      reminderTagText.innerText = `${setDateDay} ${setDateMonth} ${setDateYear}, ${setDateHour}:${setDateMinutes}`;
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