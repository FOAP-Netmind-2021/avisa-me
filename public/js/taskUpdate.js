// Recuperar todas las fechas y añadirle la clase reminderTagThrough a las que sean inferiores a la hora actual (new Date())
let allReminderDates = document.querySelectorAll(".reminderTagText");
allReminderDates.forEach(reminderDate => {
  if(new Date(reminderDate.dataset.reminderdate) < new Date()){
    reminderDate.classList.add("reminderTagThrough");
    reminderDate.classList.remove("reminderTagText");
  }
})
console.log(allReminderDates);



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
  let reminderTagTextSpan = event.currentTarget.querySelector(`#reminderTagTextSpan-${idTask}`)
  let reminderTagTextDay; //Solventar bug y añadir aqui por querySelector cada uno de los spans para añadirle en la linea 49 cada cosa correspondiente
  let reminderTagTextMonth;
  let reminderTagTextYear;
  let reminderTagTextHour;
  let reminderTagTextMinutes;
  console.log(reminderTagTextSpan)
  if(reminderDate && reminderHour){
    setTimeout(() => {
      let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
      let setDateDay = setDate.getDate();
      let setDateMonth = months[parseInt(setDate.getMonth())];
      let setDateYear = setDate.getFullYear();
      let setDateHour = setDate.getHours();
      let setDateMinutes = setDate.getMinutes()<10?"0"+setDate.getMinutes():setDate.getMinutes();
      reminderTag.removeAttribute("hidden");
      //SOLVENTAR ESTE BUG relacionado con la linea 33
      reminderTagTextSpan.innerText = `<span>${setDateDay}</span> <span id="reminderMonth">${setDateMonth}</span> <span>${setDateYear}</span>, <span>${setDateHour}</span>:<span>${setDateMinutes}</span>`;
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