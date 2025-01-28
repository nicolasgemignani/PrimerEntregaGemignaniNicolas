import { Router } from "express";
import passport from "passport";

import SessionController from "../../controller/api/session.controller.js";

import { passportCall } from "../../jwt/midllewares/jwtMiddles.js";
import { authorization } from "../../authorization/authorization.js";
import { verifyToken } from "../../jwt/midllewares/jwtMiddles.js";

const router = Router()
const sessionController = new SessionController()

// Ruta para crear un nuevo usuario
router.post('/register', sessionController.registro);

// Ruta para Loguear 
router.post('/login', sessionController.login);

// Ruta para el refreshToken
router.post('/refreshToken', sessionController.refreshToken)

// Ruta para cerrar sesion
router.post('/logout', verifyToken, passportCall('jwt', { session: false }), sessionController.logout);

// Ruta current Prueba de autenticidad
router.get('/current', passportCall('jwt', {session: false}), authorization('admin'), sessionController.current)

export default router