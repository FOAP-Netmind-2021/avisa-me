const workspaceModel = require("../models/workspaceModel");

exports.completedTask = async (req, res) => {
    res.send('Task completed:' + req.params.idTask)
}

exports.updateTask = async (req, res) => {
    res.send(req.body);
}