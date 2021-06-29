const workspaceModel = require("../models/workspaceModel");

exports.renderHome = async (req, res) => {
  
  res.render("index", {
    title: "Avisa.me",
  });

};

exports.renderWorkspace = async (req, res) => {

  const { idWorkspace } = req.params;
  
  res.send(idWorkspace);

};

exports.createWorkspace = async (req, res) => {
  const { title, text } = req.body;

  const workspace = new workspaceModel({
    tasks: { title : title , text : text },
  });

  const newWorkspace = await workspace.save();

  res.redirect(`/${newWorkspace._id}`);
};
