//Importation de mongoose pour creer des schema et interagir avec la base de donnée
const mongoose = require("mongoose");
//Importation de mongoose-unique-validator , un plugin qui valide l'unicité des champs 
const uniqueValidator = require('mongoose-unique-validator');

// Schema qui decrit la structure d'un document utilisateur 
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true}
});

//Application du plugin UniqueValidator qui garanti l'unicité 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);