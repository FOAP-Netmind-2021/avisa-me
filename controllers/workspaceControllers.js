
const workspaceModels = require('../models/workspaceModel');

exports.renderHome = async (req, res) => {
    
    res.render('index', { title: 'Avisa.me' });
    
}