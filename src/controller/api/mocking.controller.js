import { productService, userService } from "../../service/index.service.js"
import { generateMockProducts, generateMockUsers } from "../../utils/mocking/mocking.js"


class MockingController {

    createUsers = async (req, res) => {
        try {
            const mockUsers = generateMockUsers(50)
            res.status(200).json({
                status: 'success', payload: mockUsers
            })
        } catch (error) {
            console.error('Error al generar usuarios mocks', error)
            res.status(500).json({ status: 'error', message: 'Error al generar usuarios moks'})
        }
    }

    createProducts = async (req, res) => {
        try {
            const mockProducts = generateMockProducts(50)
            res.status(200).json({
                status: 'success', payload: mockProducts
            })
        } catch (error) {
            console.error('Error al generar productos mocks', error)
            res.status(500).json({ status: 'error', message: 'Error la generar productos mocks'})
        }
    }

    generateData = async (req, res) => {
        try {
            // Generar datos mock
            const mockUsers = generateMockUsers(50)
            const mockProducts = generateMockProducts(50)

            // Guardar datos en la base de datos
            const savedUsers = await userService.createUsers(mockUsers)
            const savedProducts = await productService.createProducts(mockProducts)

            res.status(201).json({
                status: 'success',
                message: 'Mock data generada y guardada correctamente',
                payload: {
                    users: savedUsers,
                    products: savedProducts
                }
            })
        } catch (error) {
            console.error('Error al guardar datos mock en la base de datos')
            res.status(500).json({
                status: 'error',
                message: 'Error al guardar mocks en la base de datos'})
        }
    }

    getUsers = async (req, res) => {
        try {
            const users = await userService.getAllUsers()
            res.status(200).json({
                status: 'success',
                payload: users
            })
        } catch (error) {
            console.error('Error al obtener usuarios', error)
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener usuarios'
            })
        }
    }

    getProducts = async (req, res) => {
        try {
            const products = await productService.getAllProducts({
                limit: 100,
                page: 1,
                sort: {},
                query: {}
            })

            res.status(200).json({
                status: 'success',
                payload: products.docs
            })
        } catch (error) {
            console.error('Error al obtener productos', error)
            res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos'
            })
        }
    }
}

export default MockingController