import blacklistModel from "../models/blacklist.model.js"

class BlacklistDaoMongo {
    constructor(){
        this.blacklistModel = blacklistModel
    }
    insert = async (token, expiresIn) => {
        if (isNaN(expiresIn)) {
            throw new Error('expiresIn must be a valid number');
        }
    
        const expirationDate = new Date();
        expirationDate.setSeconds(expirationDate.getSeconds() + expiresIn);
    
        if (isNaN(expirationDate.getTime())) {
            throw new Error('Invalid expiration date');
        }
    
        const blacklistedToken = new this.blacklistModel({
            token,
            expiresAt: expirationDate,
        });
    
        return await blacklistedToken.save(); // Guardar el token en la base de datos
    }

    getOne      = async (filter) => await this.blacklistModel.findOne(filter)
}        

export default BlacklistDaoMongo