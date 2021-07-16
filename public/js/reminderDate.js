/* let idTask;
let reminderDatePicker = document.querySelector(`reminder-date-${idTask}`);
let reminderHourPicker = document.querySelector(`reminder-date-${idTask}`);
let reminderDate;
let reminderHour;

reminderDatePicker.addEventListener("focusout", (event)=>{
    idTask=event.currentTarget.dataset.id;
    reminderDate = event.currentTarget.value;
    reminderHour = event.currentTarget.value;
    console.log("fecha:",reminderDate)
    console.log("hora:", reminderHour);
}) */