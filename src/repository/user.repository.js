import UserDto from "../dto/user.dto.js"

class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    createUser = async (userData) => await this.dao.create(userData)

    createUsers = async (userData) => await this.dao.creates(userData)

    getAllUsers = async () => {
        const users = await this.dao.getAll({})
        return users.map(user => new UserDto(user))
    }

    getUser = async (userId) => await this.dao.getOne(userId)

    get = async (userId) => await this.dao.get({ _id: userId });

    updateUser = async (userId, updateData) => await this.dao.update(userId, updateData)

    deleteUser = async (userId) => await this.dao.delete(userId)
    
    updateTokenId = async (userId, tokenId) => await this.dao.updateTokenId(userId, tokenId)
}

export default UserRepository