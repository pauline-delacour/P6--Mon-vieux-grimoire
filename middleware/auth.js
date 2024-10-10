const jwt = require ('jsonwebtoken');
require ('dotenv').config();


/**
 * Middleware d'authentification 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
module.exports = (req, res, next) => {
    try {
        //Récuperation du token JWT depuis l'en-tete authorization 
        const token = req.headers.authorization.split(' ')[1];
        //Vérification et decodage du token à l'aide de la clé secrète 
        const decodedToken = jwt.verify(token,process.env.TOKEN);
        //Récupération de l'identifiant utilisateur (userId) du token décodé
        const userId = decodedToken.userId;
        //Ajout de l'id au requete pour qu'il soit accessible pour les prochaines etapes
        req.auth = {
            userId: userId // Stocke l'id dans l'objet auth de la requete
        };
        next();
    } catch (error) {
        res.status(401).json({ error });
    }
}