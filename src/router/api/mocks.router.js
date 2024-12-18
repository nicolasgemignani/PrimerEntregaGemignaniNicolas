import { Router } from "express";
import MockingController from '../../controller/api/mocking.controller.js'

const router = Router()

const mockingController = new MockingController()

router.get('/mockingusers', mockingController.createUsers)
router.get('/mockinproducts', mockingController.createProducts)
router.post('/generatedata', mockingController.generateData)
router.get('/users', mockingController.getUsers)
router.get('/products', mockingController.getProducts)

export default router