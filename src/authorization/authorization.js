import jwt from 'jsonwebtoken'

import { blacklistService } from "../service/index.service.js";
import { variables } from "../config/var.entorno.js";

export const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: 'User not authenticated' })
        }

        // Verificar si el rol del usuario está dentro de los roles permitidos
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Forbidden: You do not have the required role' })
        }

        next()
    };
};

export const authToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: 'Access denied: No token provided' });
        }

        // Decodificar el token JWT para obtener el tokenId
        const decoded = jwt.verify(token, variables.PRIVATE_KEY);

        const { tokenId } = decoded; // Extraer el tokenId del payload del token
        if (!tokenId) {
            return res.status(400).json({ message: 'Invalid token: tokenId missing' });
        }

        // Verificar si el tokenId está en la blacklist
        const blacklisted = await blacklistService.getToken({ token: tokenId });

        if (blacklisted) {
            return res.status(403).json({ message: 'Access denied: Token invalidated' });
        }

        // Si todo está bien, adjuntar la información del usuario a la solicitud
        req.user = decoded;
        next(); // Pasar al siguiente middleware o controlador
    } catch (error) {
        console.error("Error en el authMiddleware:", error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Access denied: Token expired' });
        }
        
        res.status(500).json({ message: 'Internal server error' });
    }
};
