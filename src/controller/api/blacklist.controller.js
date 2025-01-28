import { blacklistService } from "../../service/index.service.js";

class BlacklistController {
    constructor() {
        this.blacklistService = blacklistService;
    }

    // Método para agregar un token a la lista negra
    addToBlacklist = async (req, res) => {
        const { token, expiresIn } = req.body;
        try {
            // Validar que el token y expiresIn sean válidos
            if (typeof token !== 'string' || token.trim() === '') {
                return res.status(400).json({ error: 'Invalid token: must be a non-empty string' });
            }
    
            if (isNaN(expiresIn) || expiresIn <= 0) {
                return res.status(400).json({ error: 'expiresIn must be a valid positive number' });
            }
    
            // Llamar al repositorio para insertar el token en la lista negra
            await blacklistService.createRegistro(token, expiresIn);
    
            // Responder con éxito
            return res.status(200).json({ message: 'Token added to blacklist successfully' });
        } catch (error) {
            // Manejo de errores
            console.error('Error adding token to blacklist:', error);
            return res.status(500).json({ error: 'An error occurred while adding the token to the blacklist' });
        }
    };

    
    getTokenBlacklist = async (req, res) => {
        try {
            // Obtener el tokenId del usuario autenticado
            const { tokenId } = req.user;
    
            if (!tokenId) {
                return res.status(400).json({ message: 'TokenId is missing' });
            }
    
            // Buscar el token en la blacklist usando el servicio
            const blacklistToken = await blacklistService.getToken(tokenId);
    
            console.log("Token encontrado en blacklist:", blacklistToken);
    
            if (!blacklistToken) {
                return res.status(404).json({ message: 'Token not found in blacklist' });
            }
    
            // Responder con el token encontrado
            res.status(200).json({ token: blacklistToken });
        } catch (error) {
            console.error("Error en getTokenBlacklist:", error);
            res.status(500).json({ message: 'Internal server error' });
        }
    };

}

export default BlacklistController;
