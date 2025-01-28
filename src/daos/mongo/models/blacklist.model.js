import mongoose from "mongoose"

const collectionName = 'blacklist'

const blacklistSchema = new mongoose.Schema({
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }, // Fecha de expiración del token
})

// Crea el modelo de 'cart' basado en el esquema definido
const blacklistModel = mongoose.model(collectionName, blacklistSchema)

// Exporta el modelo de carrito para usarlo en otros modulos
export default blacklistModel