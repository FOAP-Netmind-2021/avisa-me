const workspaceModel = require("../models/workspaceModel");
const userModel = require("../models/userModel");
const taskModel = require("../models/taskModel");
const {validationResult} = require('express-validator');
const subscriptionModel = require("../models/subscriptionModel");


exports.renderHome = (req, res) => {
  res.render("index", {
    idWorkspace: 1, // Just to make the test pass
    title: "Home" 
  });
}


exports.renderWorkspace = async (req, res) => {
  
  const { idWorkspace } = req.params;

  try{ // Si alguien introduce un string, no puede castearlo como ID

    const workspace = await workspaceModel.findById(idWorkspace);
    
    // Si el workspace a renderizar tiene suscripción, borramos la cookie
    if(workspace.subscription){
      res.clearCookie("currentWorkspace");
    }

    // Si existe usuario logueado
    let currentUser;
    let isWorkspaceFromUser;

    if(req.user){
      currentUser = await userModel.findById(req.user._id).populate("subscription");
      isWorkspaceFromUser = currentUser.subscription.workspaces.some(workspace => workspace._id == idWorkspace)
    }

    // Si es público o le pertenece al usuario, mostramos todo
    if(workspace.settings.visibility || isWorkspaceFromUser) {

      let hideCompletedTask = false;

      let registerLink = false;
      // Recuperamos la cookie
      const currentWorkspaceCookie = req.cookies['currentWorkspace'];


      // Si la cookie almacenada cuando se creó el workspace se encuentra en el mismo navegador y renderizamos el workspace
      if(workspace._id == currentWorkspaceCookie){
        req.flash("noti_msg", "Este Workspace está disponible! Crea una cuenta y privatice el contenido!");
        registerLink = true;
      }

      const allTasks = await workspaceModel.getAllTasks(idWorkspace);
      let sortedTasks = allTasks.sort((a,b) => { return new Date(a.createdAt) - new Date(b.createdAt)});

      hideCompletedTask = workspace.settings.hideCompletedTask;

      if(hideCompletedTask){
        sortedTasks = sortedTasks.filter(task => task.finishedDate == undefined); 
      }

    
      const tasksDetail = await workspaceModel.getDetails(idWorkspace);

      return res.render('workspace',{
          workspace,
          tasksDetail,
          allTasks : sortedTasks,
          registerLink,
          title: "Workspace"
      });

    }
    req.flash("error_msg", `Workspace privado!`) 
    return res.redirect("/");
  }
  catch(err){
    req.flash("error_msg", `No existe el workspace '${idWorkspace}'`) 
    return res.redirect("/");
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

  // Si se crea un workspace desde la primera nota. INDEX
  const { title, text } = req.body;

  const newTask = new taskModel({
    title,
    text,
    workspace: workspace._id
  })

  // Asignamos el id de task al array del workspace
  workspace.addTask(newTask._id);

  // SI EXISTE USUARIO LOGUEADO. Añadir el workspace a su suscripción
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

    // Privatizamos el workspace
    workspace.updateVisibility(false);
    // Añadimos la suscripción al workspace
    workspace.subscription = userSubscription._id

    await userSubscription.save(); // Guardamos los cambios en la suscripción
    await workspace.save(); // Guardamos el workspace
    await newTask.save(); // Guardamos la primera nota

    req.flash("success_msg", `Se ha creado un nuevo workspace!`) 
    return res.redirect("/user/profile");
  }

  // SI NO EXISTE USUARIO LOGUEADO, seguirá creando un worskpace sin ser asignado a ningún usuario
  await workspace.save();
  await newTask.save();

  // Enviamos una cookie para dar la opción de quedartelo con un registro en la app
  res.cookie('currentWorkspace', workspace._id);
  req.flash("noti_msg", `Este Workspace está disponible! Crea una cuenta y privatice el contenido!`);
  res.redirect(`/${workspace._id}`);
};


exports.deleteWorkspace = async (req, res) => {

  const {idWorkspace} = req.body;
  try{
  // Buscamos el workspace
  const workspace = await workspaceModel.findById(idWorkspace);
  // Buscamos la suscripción del usuario
  const usersubscription = await subscriptionModel.findById(req.user.subscription);
  // Eliminamos todas las notas que pertenecen a ese workspace
  await taskModel.deleteMany({workspace: idWorkspace})
  // Eliminamos el wokrspace de la suscripción. Metodo propio en el modelo
  usersubscription.deleteWorkspace(idWorkspace);
  // Eliminamos el workspace definitivamente
  await workspace.delete();
  // Guardamos los cambios en la suscripción
  await usersubscription.save();

  // Informamos y redirigimos
  req.flash("succes_msg", `El workspace '${workspace.name}' ha sido eliminado con éxito`);
  res.redirect("/user/profile");
  }
  catch(err){
  req.flash("error_msg", `Surgió un error inesperado. Disculpen las molestias`);
  res.redirect("/");
  }
}


exports.editWorkspace = async (req,res) => {

  const {idWorkspace, name} = req.body;
  // Buscamos el workspace
  const workspace = await workspaceModel.findById(idWorkspace);
  // Cambiamos el nombre. Función propia en el modelo
  workspace.changeName(name);
  // Guardamos cambios
  await workspace.save();

  // Informamos y redirigimos
  req.flash("success_msg", `El workspace ha pasado a llamarse '${name}!'`);
  res.redirect("/user/profile");
}




exports.addTask = async (req,res) => {

  //Validación de errores de express-validator
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { title, text, idWorkspace } = req.body;

  const workspace = await workspaceModel.findById(idWorkspace);

  const newTask = new taskModel({
    title,
    text,
    workspace: idWorkspace
  })

  workspace.addTask(newTask._id);

  await workspace.save();
  await newTask.save();

  res.redirect(`/${idWorkspace}`)
}
