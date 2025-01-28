class BlacklistRepository {
    constructor(dao) {
        this.dao = dao
    }
    // Método para crear un registro en la lista negra
    createRegistro = async (token, expiresIn) => {
        if (typeof token !== 'string' || token.trim() === '') {
            throw new Error('Invalid token: must be a non-empty string');
        }
    
        if (isNaN(expiresIn) || expiresIn <= 0) {
            throw new Error('expiresIn must be a valid positive number');
        }
    
        return await this.dao.insert(token, expiresIn);
    }

    getToken = async (token) => await this.dao.getOne(token)
}

export default BlacklistRepository