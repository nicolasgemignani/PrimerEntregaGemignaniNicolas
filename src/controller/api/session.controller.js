import jwt from 'jsonwebtoken'

import CurrentUserDTO from "../../dto/current.dto.js";
import { userService } from "../../service/index.service.js";
import { generateTokens } from "../../jwt/generateJwt.js";
import { variables } from "../../config/var.entorno.js";

class SessionController {
    constructor(){
        this.userService = userService
    }

    registro = async (req, res) => {
        const { first_name, last_name, email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ status: 'error', error: 'Ingrese email y password' })
        }
    
        const userFound = await userService.getUser({ email })
    
        if (userFound) {
            return res.status(401).send({ status: 'error', error: 'El usuario ya existe' })
        }
    
        const newUser = {
            first_name,
            last_name,
            email,
            password
        };
    
        const result = await userService.createUser(newUser)
        res.redirect('/login') // Mensaje de éxito
    }

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const userFound = await userService.getUser({ email })
            if (!userFound) {
                return res.status(404).send({ status: 'error', error: 'No existe el usuario' })
            }
    
            const isMatch = await userFound.comparePassword(password)
            if (!isMatch) {
                return res.render('login', { error: 'Contraseña incorrecta' })
            }

            const cartId = userFound.cart

            const { accessToken, refreshToken } = generateTokens({
                id: userFound._id, 
                role: userFound.role, 
                first_name: userFound.first_name, 
                cart: cartId,
                email: userFound.email
            })

            res.cookie('token', accessToken, {
                httpOnly: true,
                secure: false, // Solo en desarrollo
            });
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // Solo en desarrollo
            });
            return res.redirect('/products')
        } catch (error) {
            console.error(error); // Log para el seguimiento de errores
            res.render('login', { error: 'Error al iniciar sesión. Inténtalo de nuevo.' })
        }
    }

    refreshToken = async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token no proporcionado' });
        }
    
        try {
            const decoded = jwt.verify(refreshToken, variables.REFRESH_KEY);
            const { id, first_name, email, role, cart, tokenId } = decoded;
    
            // Verificar el tokenId
            const user = await userService.getUser(id);
            if (!user || user.tokenId !== tokenId) {
                return res.status(403).json({ message: 'Refresh token invalido' });
            }
    
            // Generar nuevos tokens
            const { accessToken, refreshToken: newRefreshToken } = generateTokens({
                id, first_name, email, role, cart
            });
    
            // Actualizar el tokenId en la base de datos
            userService.updateTokenId(id, crypto.randomUUID()); // Generar un nuevo tokenId
    
            // Enviar los nuevos tokens
            res.cookie('token', accessToken, {
                maxAge: 1000 * 60 * 15, // 15 minutos
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
    
            res.cookie('refreshToken', newRefreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 7, // 7 días
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'Strict',
            });
    
            return res.json({ accessToken });
        } catch (error) {
            console.error('Error al refrescar el token', error);
            return res.status(403).json({ message: 'Refresh token invalido' });
        }
    };

    logout = async (req, res) => {
        res.clearCookie('token'); // Limpia la cookie del token
        res.clearCookie('refreshToken') // Limpiar la cookie del refresh token
        res.redirect('/login')
    }

    current = async (req, res) => {
        try {
            const userDTO = new CurrentUserDTO(req.user)
            res.send({ dataUser: userDTO, message: 'datos senscibles' })
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener la información del usuario' });
        }
        
    }
}

export default SessionController