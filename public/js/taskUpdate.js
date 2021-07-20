//let colorrr;

function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let data = {idTask, titleModified, textModified, colorTask};
  
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
    // let idTask = event.currentTarget.dataset.id;
    // let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
    // let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
    let idTask = event.currentTarget.dataset['idColores'];
    let SelectedbackgroundColor = event.target.style.backgroundColor;
    //colorrr = SelectedbackgroundColor;
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