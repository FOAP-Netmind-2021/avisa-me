const taskModel = require("../models/taskModel");
const workspaceModel = require("../models/workspaceModel");

exports.completedTask = async (req, res) => {

  const {idTask} = req.params;
  const task = await taskModel.findById(idTask);
  task.finishedDate = new Date();
  await task.save();

  req.flash("success_msg", `Tarea completada!`);
  res.redirect(`/${task.workspace}`);
}

exports.uncompletedTask = async (req, res) => {

  const {idTask} = req.params;
  const task = await taskModel.findById(idTask);
  task.finishedDate = null;
  await task.save();
  
  req.flash("success_msg", `Tarea activa de nuevo!`);
  res.redirect(`/${task.workspace}`);
}

exports.updateTask = async (req, res) => {
  const { idTask, titleModified, textModified, reminderDate, reminderHour } = req.body;

  const task = await taskModel.findById(idTask);
  task.title = titleModified.replace(/\n*/g, '').trim();
  task.text = textModified.replace(/\n*/g, '').trim();
  if (reminderDate && reminderHour) {
    let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
    task.reminderDate = setDate;
    task.reminderNotification = null;
  }
  
  await task.save();

  res.send({
    success : true,
  })

};


exports.updateTaskColores = async (req, res) => {
  const { idTask, SelectedbackgroundColor } = req.body;

  const task = await taskModel.findById(idTask)
  task.color = SelectedbackgroundColor;
  await task.save();

  res.send({
    success : true,
  })

};

// Marcar tarea en papelera. POST
exports.trashedTask = async (req, res) => {

  // Nos envían el id del workspace y de la tarea
  const { idWorkspace, idTask } = req.body;
  // Recuperamos la tarea
  const task = await taskModel.findById(idTask);
  // Si la tarea no pertenece al workspace... Seguridad
  if(task.workspace ==! idWorkspace){
    req.flash("error_msg", `Error interno`);
    return res.redirect("/");
  }
  // Establecemos la propiedad papelera en true
  task.trashed = true;
  // Guardamos
  await task.save();
  
  // Redireccionamos e informámos
  req.flash("success_msg", `Se ha enviado la nota a la papelera!`);
  return res.redirect(`/${idWorkspace}`); 
};


// Desmarcar tarea de papelera. POST
exports.restoreTask = async (req, res) => {

  // Nos envían el id del workspace y de la tarea
  const { idWorkspace, idTask } = req.body;
  // Recuperamos la tarea
  const task = await taskModel.findById(idTask);
  // Si la tarea no pertenece al workspace... Seguridad
  if(task.workspace ==! idWorkspace){
    req.flash("error_msg", `Error interno`);
    return res.redirect("/");
  }
  // Establecemos la propiedad papelera en false
  task.trashed = false;
  // Guardamos
  await task.save();
  
  // Redireccionamos e informámos
  req.flash("success_msg", `Se ha restaurado la nota de la papelera!`);
  return res.redirect(`/${idWorkspace}`); 
};



// Eliminar tarea. POST
exports.deleteTask = async (req, res) => {
 
  // Nos envían el id del workspace y de la tarea
  const { idWorkspace, idTask } = req.body;
  // Recuperamos la tarea y el workspace
  const task = await taskModel.findById(idTask);
  const workspace = await workspaceModel.findById(idWorkspace);
  
  if(task.workspace != idWorkspace){
    req.flash("error_msg", `Error interno`);
    return res.redirect("/"); 
  }

  // Eliminamos la tarea del workspace. Método propio del modelo
  workspace.deleteTask(idTask);
  // Eliminamos la tarea
  await task.delete();
  // Guardamos
  await workspace.save();

  // Redireccionamos e informámos
  req.flash("success_msg", `Se ha eliminado la nota!`);
  return res.redirect(`/trashspace/${idWorkspace}`); 
};


// Eliminar todas las tareas de la papelera. POST
exports.deleteTrashedTasks = async (req, res) => {

  // Nos envían el id del workspace
  const { idWorkspace } = req.body;
  // Localizamos el workspace
  const workspace = await workspaceModel.findById(idWorkspace);
  // Recuperamos todas las tares del workspace anterior cuya propiedad de papelera está en true. Método propio en el modelo.
  const trashedTasks = await workspaceModel.getTrashedTasks(idWorkspace);
  // Extreamos los IDs de estas tareas. Los ObjectID deben parsearse a string para compararlos.
  const trashedTasksId = trashedTasks.map(task => task._id.toString());
  // Establecemos que en el workspace van a desaparecer las tareas que se encuentran en la papelera (referenciadas) con un filter
  workspace.tasks = workspace.tasks.filter(taskId => {
    const itemId = taskId._id.toString();
    if (!trashedTasksId.includes(itemId)) {
      return taskId._id;
    }
  });

  // Una vez, el workspace.tasks no tenga las tareas que estaban en la papelera, proceder a guardar.
  await workspace.save();
  // Ahora es momento de eliminar las tareas
  await taskModel.deleteMany({workspace: idWorkspace, trashed : true});

  // Redireccionar e informar
  req.flash("success_msg", `Se han eliminado todas las notas!`);
  return res.redirect(`/trashspace/${idWorkspace}`); 
};

exports.updateReminderDate = async (req,res)=>{
  const {idTask, reminderDate, reminderHour} = req.body;
  const task = await taskModel.findById(idTask);
  if (reminderDate && reminderHour) {
    let setDate = new Date(`${reminderDate}T${reminderHour}:00`);
    task.reminderDate = setDate;
    task.reminderNotification = null;
  }
  
  await task.save();

  res.send({
    success : true,
  })

}