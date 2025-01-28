import express from 'express'
import BlacklistController from '../../controller/api/blacklist.controller.js'

const router = express.Router()
const blacklist = new BlacklistController()

router.post('/blacklist', blacklist.addToBlacklist)

export default router
