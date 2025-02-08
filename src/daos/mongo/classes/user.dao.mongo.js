import userModel from '../models/user.model.js'
import cartModel from '../models/cart.model.js'
import mongoose from 'mongoose';

class UserDaoMongo {
    constructor() {
        this.userModel = userModel;
        this.cartModel = cartModel
    }

    // Crear un nuevo usuario
    create = async (filter) => {
        // Crear el nuevo usuario
        const newUser = await this.userModel.create(filter);

        // Crear un nuevo carrito vinculado al usuario
        const newCart = await this.cartModel.create({ user: newUser._id, products: [] });

        // Actualizar el usuario con el ID del carrito
        newUser.cart = newCart._id;
        await newUser.save();

        return newUser;
    }     

    // Crea varios usuarios al mismo tiempo
    /* creates = async (usersData) => {
        const createdUsers = [] // Lista para almacenar los usuarios creados

        for (const userData of usersData) {

            // Crear al nuevo usuario
            const newUser = await this.userModel.create(userData)

            // Crear un nuevo carrito vinculado al usuario
            const newCart = await this.cartModel.create({ user: newUser._id, products: [] })

            // Actualizar el usuario con el id de carrito
            newUser.cart = newCart._id
            await newUser.save()

            // Agregar el usuario a la lista de resultado
            createdUsers.push(newUser)
        }
        return createdUsers
    } */

    // Optimizamos creates con Promises.all
    creates = async (usersData) => {
        const createdUsers = await Promise.all(usersData.map(async (userData) => {
            // Crear el nuevo usuario
            const newUser = await this.userModel.create(userData);
    
            // Crear un nuevo carrito vinculado al usuario
            const newCart = await this.cartModel.create({ user: newUser._id, products: [] });
    
            // Actualizar el usuario con el ID del carrito
            newUser.cart = newCart._id;
            await newUser.save();
    
            return newUser;
        }));
    
        return createdUsers;
    };

    // Obtener todos los usuarios
    getAll = async () => await this.userModel.find()

    // Buscar un usuario por filtro
    getOne = async (filter) => await this.userModel.findOne(filter)

    get = async (filter) => {
        if (!mongoose.Types.ObjectId.isValid(filter)) {
            throw new Error("Invalid ObjectId");
        }
        return await this.userModel.findOne({ _id: new mongoose.Types.ObjectId(filter) });
    };
            
    // Actualizar un usuario por ID
    update = async (filter, updateData) => await this.userModel.findByIdAndUpdate(filter, updateData, { new: true });
            
    // Borrar un usuario por ID
    delete = async (filter) => await this.userModel.findByIdAndDelete(filter)

    // Ejemplo de servicio para actualizar el tokenId
    updateTokenId = async (userId, tokenId) => {
        return await this.userModel.findByIdAndUpdate(userId, { tokenId }, { new: true });
      }

}

export default UserDaoMongo