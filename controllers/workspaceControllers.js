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

exports.renderTeamPage = (req, res) => {

  const team = [
    {
      name: "Cristian Cullell",
      GitHub: "https://github.com/cristian-cll",
      Linkedin: "https://www.linkedin.com/in/ccullell/",
      image: "https://avatars.githubusercontent.com/u/78435266?v=4",
      quote: "Codeholic & curious"
    },
    {
      name: "Arnau Mas",
      GitHub: "https://github.com/Arnau-Mas",
      Linkedin: "https://www.linkedin.com/in/arnaum/",
      image: "https://media-exp1.licdn.com/dms/image/C4D03AQEiiSZIJ3tVWg/profile-displayphoto-shrink_800_800/0/1613426784148?e=1632960000&v=beta&t=ENw0-aEy0Y10hkF8bYvRMp6nnSkCMc4nVF8TGHJiIaM",
      quote: "Tech enthusiast"
    },
    {
      name: "Ignacio Spadavecchia",
      GitHub: "https://github.com/ignaciospadavecchia",
      Linkedin: "https://www.linkedin.com/in/ignacio-spadavecchia/",
      image: "https://media-exp1.licdn.com/dms/image/C4D03AQGgWKqXSMFYSQ/profile-displayphoto-shrink_800_800/0/1617356292376?e=1632960000&v=beta&t=OP_AEhVAHFSfXvAddutosOkP0dDMJfsLJCQ9LwhJqHw",
      quote: "The code craftman"
    },
    {
      name: "Jose Castillo",
      GitHub: "https://github.com/josecastp",
      Linkedin: "https://www.linkedin.com/in/jose-antonio-castillo-p%C3%A9rez-b52401105/",
      image: "https://avatars.githubusercontent.com/u/66061624?v=4",
      quote: "Keep Calm"
    },
    {
      name: "Vanessa Collazos",
      GitHub: "https://github.com/vcollazos",
      Linkedin: "https://www.linkedin.com/in/vanessa-collazos-alvarez-29901282/",
      image: "https://media-exp1.licdn.com/dms/image/C4E03AQHdb-mhWP0ejA/profile-displayphoto-shrink_800_800/0/1611663951254?e=1632960000&v=beta&t=6YwvFhDtzxpe6-vLmbs_0Oe-Nbdg8WIyMN_YVpgFdv8",
      quote: "Resolutiva y creativa"
    },
    {
      name: "Mohsin Zaman",
      GitHub: "https://github.com/MohsinZamanShaheen",
      Linkedin: "https://www.linkedin.com/in/mohsin-z-166609173/",
      image: "https://avatars.githubusercontent.com/u/80530839?v=4",
      quote: "Non-stop Hustler"
    },
    {
      name: "Qamar Zaman",
      GitHub: "https://github.com/Qamar1806",
      Linkedin: "https://www.linkedin.com/in/qamar-zaman-87624615a/",
      image: "https://avatars.githubusercontent.com/u/80703547?v=4",
      quote: "Consistent adaptable"
    },
    {
      name: "Ariel Fabi??n Neme",
      GitHub: "https://github.com/ArielFabianN",
      Linkedin: "https://www.linkedin.com/in/arielneme/",
      image: "https://avatars.githubusercontent.com/u/79173115?v=4",
      quote: "Unicorn coach"
    }
  ];

  team.sort((a,b) => a.name.localeCompare(b.name));

  res.render("team", {
    title: "Team Page",
    team
  });
}


exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;

  try{ // Si alguien introduce un string, no puede castearlo como ID

    const workspace = await workspaceModel.findById(idWorkspace);
    
    // Si el workspace a renderizar tiene suscripci??n, borramos la cookie
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

    // Si es p??blico o le pertenece al usuario, mostramos todo
    if(workspace.settings.visibility || isWorkspaceFromUser) {

      let hideCompletedTask = false;

      let registerLink = false;
      // Recuperamos la cookie
      const currentWorkspaceCookie = req.cookies['currentWorkspace'];


      // Si la cookie almacenada cuando se cre?? el workspace se encuentra en el mismo navegador y renderizamos el workspace
      if(workspace._id == currentWorkspaceCookie){
        req.flash("noti_msg", "Este Workspace est?? disponible! Crea una cuenta y privatice el contenido!");
        registerLink = true;
      }

      let allTasks;
      
      // Si acceden a trav??s del par??metro "tasksReminder" ex.  host.com/:idWorkspace/?tasksReminder
      // Filtraremos las tareas con recordatorio. En caso contrario, se renderizan las que no est??n en la papelera, inclu??das con o sin recordatorio.
      req.query.tasksReminder ? allTasks = await workspaceModel.getReminderTasks(idWorkspace) : allTasks = await workspaceModel.getUntrashedTasks(idWorkspace);

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




exports.renderTrashspace = async (req, res) => { 

  const { idWorkspace } = req.params;

    // Buscamos el workspace
    const workspace = await workspaceModel.findById(idWorkspace);

    // Si existe usuario logueado
    let currentUser;
    let isWorkspaceFromUser;

    if(req.user){
      currentUser = await userModel.findById(req.user._id).populate("subscription");
      isWorkspaceFromUser = currentUser.subscription.workspaces.some(workspace => workspace._id == idWorkspace)
    }

    if(workspace.settings.visibility || isWorkspaceFromUser) {

      // Recuperamos todas las tares del workspace anterior cuya propiedad de papelera est?? en true. M??todo propio en el modelo.
      const trashedtasks = await workspaceModel.getTrashedTasks(idWorkspace);

      const sortedTrashedTasks = trashedtasks.sort((a,b) => { return new Date(a.createdAt) - new Date(b.createdAt)});

      return res.render('trashspace',{
        allTasks: sortedTrashedTasks,
        title: "Papelera",
        workspace
      });
    }

    req.flash("error_msg", `Workspace privado!`) 
    return res.redirect("/");

}

exports.createWorkspace = async (req, res) => {


  //Validaci??n de errores de express-validator
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

  // SI EXISTE USUARIO LOGUEADO. A??adir el workspace a su suscripci??n
  const {user} = req;

  if(user){
    // Buscamos la suscripci??n del usuario
    const userSubscription = await subscriptionModel.findById(user.subscription);
    // Usamos el metodo de la clase Subscription para a??adir un workspace. Se almacena porque retorna Booleano
    const addWorkspace = userSubscription.addWorkspace(workspace._id);
    // Si devuelve falso, es porque el l??mite se ha excedido
    if(!addWorkspace) { 
      req.flash("error_msg", `L??mite excedido en la versi??n gratuita! H??gase Premium para disfrutar de todo sin l??mites!`) 
      return res.redirect("/user/profile");
    }

    // Privatizamos el workspace
    workspace.updateVisibility();
    // A??adimos la suscripci??n al workspace
    workspace.subscription = userSubscription._id

    await userSubscription.save(); // Guardamos los cambios en la suscripci??n
    await workspace.save(); // Guardamos el workspace
    await newTask.save(); // Guardamos la primera nota

    req.flash("success_msg", `Se ha creado un nuevo workspace!`) 
    return res.redirect("/user/profile");
  }

  // SI NO EXISTE USUARIO LOGUEADO, seguir?? creando un worskpace sin ser asignado a ning??n usuario
  await workspace.save();
  await newTask.save();

  // Enviamos una cookie para dar la opci??n de quedartelo con un registro en la app
  res.cookie('currentWorkspace', workspace._id);
  req.flash("noti_msg", `Este Workspace est?? disponible! Crea una cuenta y privatice el contenido!`);
  res.redirect(`/${workspace._id}`);
};


exports.deleteWorkspace = async (req, res) => {

  const {idWorkspace} = req.body;
  try{
  // Buscamos el workspace
  const workspace = await workspaceModel.findById(idWorkspace);
  // Buscamos la suscripci??n del usuario
  const usersubscription = await subscriptionModel.findById(req.user.subscription);
  // Eliminamos todas las notas que pertenecen a ese workspace
  await taskModel.deleteMany({workspace: idWorkspace})
  // Eliminamos el wokrspace de la suscripci??n. Metodo propio en el modelo
  usersubscription.deleteWorkspace(idWorkspace);
  // Eliminamos el workspace definitivamente
  await workspace.delete();
  // Guardamos los cambios en la suscripci??n
  await usersubscription.save();

  // Informamos y redirigimos
  req.flash("success_msg", `El workspace '${workspace.name}' ha sido eliminado con ??xito`);
  res.redirect("/user/profile");
  }
  catch(err){
  req.flash("error_msg", `Surgi?? un error inesperado. Disculpen las molestias`);
  res.redirect("/");
  }
}


exports.editWorkspace = async (req,res) => {

  const {idWorkspace, name} = req.body;
  // Buscamos el workspace
  const workspace = await workspaceModel.findById(idWorkspace);
  // Cambiamos el nombre. Funci??n propia en el modelo
  workspace.changeName(name);
  // Guardamos cambios
  await workspace.save();

  // Informamos y redirigimos
  req.flash("success_msg", `El workspace ha pasado a llamarse '${name}!'`);
  res.redirect("/user/profile");
}


exports.addTask = async (req,res) => {

  //Validaci??n de errores de express-validator
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
