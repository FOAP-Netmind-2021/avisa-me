function onFocusUpdate(event){
  let idTask = event.currentTarget.dataset.id;
  let titleModified =  event.currentTarget.querySelector(`#task-title-${idTask}`).textContent;
  let textModified = event.currentTarget.querySelector(`#task-text-${idTask}`).textContent;
  let data = {idTask, titleModified, textModified};
  
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