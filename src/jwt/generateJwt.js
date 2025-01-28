import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { variables } from '../config/var.entorno.js'
import { userService } from '../service/index.service.js'

/* export const generateToken = user => {
    try {
        // Desestructuración del objeto user
        const {  id, first_name, email, role, cart } = user;

        // Incluir todos los campos relevantes en el payload del token
        return jwt.sign(
            {  id , first_name, email, role, cart },
            variables.PRIVATE_KEY,
            { expiresIn: '1d' }
        );
    } catch (error) {
        console.error("Error generando el token:", error);
        throw new Error("Error generando el token");
    }
}; */

export const generateTokens = (user) => {
    try {

        const tokenId = crypto.randomUUID(); // Generar un identificador único

        const { id, first_name, email, role, cart } = user

        const accessToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.PRIVATE_KEY,
            { expiresIn: '10m'}
        )

        const refreshToken = jwt.sign(
            { id, first_name, email, role, cart, tokenId },
            variables.REFRESH_KEY,
            { expiresIn:'1d'}
        )

        // Guardar el tokenId en la base de datos
        userService.updateTokenId(user.id, tokenId);

        return { accessToken, refreshToken }
    } catch (error) {
        console.error('Error generando los tokens', error)
        throw new Error('Error generando los tokens')
    }
}