const workspaceModel = require("../models/workspaceModel");
const taskModel = require("../models/taskModel");
const {validationResult} = require('express-validator');
const subscriptionModel = require("../models/subscriptionModel");


exports.renderHome = (req, res) => {
  res.render("index");
}


exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;

  try{

    const workSpace = await workspaceModel.findById(idWorkspace)
    let hideCompletedTask = false;
    if(workSpace) {
      // Recuperamos la cookie
      const currentWorkspaceCookie = req.cookies['currentWorkspace'];
      // Si la cookie almacenada cuando se creó el workspace se encuentra en el mismo navegador y renderizamos el workspace
      if(workSpace._id == currentWorkspaceCookie){
        req.flash("noti_msg", "Este Workspace está disponible! Crea una cuenta y privatice el contenido!");
      }

      
      const allTasks = await workspaceModel.getAllTasks(idWorkspace);
      let sortedTasks = allTasks.sort((a,b) => { return new Date(a.createdAt) - new Date(b.createdAt)});

      hideCompletedTask = workSpace.settings.hideCompletedTask;

      if(hideCompletedTask){
        sortedTasks = sortedTasks.filter(task => task.finishedDate == undefined); 
      }

    return res.render('workspace',{
        allTasks : sortedTasks,
        idWorkspace,
    })

  }
  }
  catch(err){
    return res.status(404).send(`El worskpace ${idWorkspace} no existe o ha sido eliminado. <a href="/">Crea uno nuevo</a>`)
  }
};

exports.createWorkspace = async (req, res) => {


  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    
  // Creamos un workspace
  const workspace = new workspaceModel();

  // Si existe un usuario logueado. Añadir el workspace a su suscripción
  const {user} = req;

  if(user){
    // Buscamos la suscripción del usuario
    const userSubscription = await subscriptionModel.findById(user.subscription);
    // Usamos el metodo de la clase Subscription para añadir un workspace. Se almacena porque retorna Booleano
    const addWorkspace = userSubscription.addWorkspace(workspace._id);
    // Si devuelve falso, es porque el límite se ha excedido
    if(!addWorkspace) { 
      req.flash("error_msg", `Límite excedido en la versión gratuita! Hágase Premium para disfrutar de todo sin límites!`) 
      return res.redirect("/user/profile");
    }

    userSubscription.save(); // Guardamos los cambios en la suscripción
    await workspace.save(); // Guardamos el workspace

    return res.redirect("/user/profile");
  }

  // Si no hay usuario logueado, seguirá creando un worskpace sin ser asignado a ningún usuario
  await workspace.save();


  // Si se crea un workspace desde la primera nota. INDEX
  const { title, text } = req.body;

  const newTask = new taskModel({
    title,
    text,
    workspace: workspace._id
  })

  await newTask.save();

  // Enviamos una cookie para dar la opción de quedartelo con un registro en la app
  res.cookie('currentWorkspace', workspace._id);
  req.flash("noti_msg", "Este Workspace está disponible! Crea una cuenta y privatice el contenido!");
  res.redirect(`/${workspace._id}`);
};

exports.addTask = async (req,res) =>{

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { title, text, idWorkspace } = req.body;

  const newTask = new taskModel({
    title,
    text,
    workspace: idWorkspace
  })

  await newTask.save();

  res.redirect(`/${idWorkspace}`)
}
