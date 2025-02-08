import * as chai from 'chai';
import supertest from 'supertest'
import mongoose from 'mongoose'

const expect = chai.expect
const requester = supertest('http://localhost:8080')

mongoose.connect('mongodb+srv://nicolasgemignani:GFzb1IGgC88ILOB9@codercluster.nyb7o.mongodb.net/BaseMongo?retryWrites=true&w=majority&appName=CoderCluster')

describe('Testing', () => {
    describe('Test de Session', () => {

        let cookie

        it('El endpoint POST api/sessions/register debe registrar un usuario correctamente', async () => {
            const registro = {
                first_name: "Nicolasdsa",
                last_name: "Gemignanidsa",
                email: "nicolasgemignanidsa@outlook.com",
                password: "123456dsa"
            }

            const registrado = await requester.post('/api/sessions/register').send(registro)
            expect(registrado.status).to.equal(302);
            expect(registrado.headers.location).to.equal('/login');
        })

        it('El endpoint POST api/sessions/login debe loguear correctamente un usuario', async () => { 
            const login = {
                email:"nicolasgemignani@outlook.com",
                password:"123456"
            }
            const logueado = await requester.post('/api/sessions/login').send(login)

            const cookieResult = logueado.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('token')
            expect(cookie.value).to.be.ok
        })

        it('El endpoint POST api/sessions/logout debe desloguear correctamente al usuairo', async () => {

        })

        it('El endpoint GET api/sessions/current debe mostra informacion valiosa solo al admin', async () => {

        })
        
        
    })

    describe('Test de productos', () => {
        beforeEach(async function () {
            await mongoose.connection.collection('products').deleteMany({});
            this.timeout(5000);
        });

        it('El endpoint POST /api/products debe crear un producto correctamente', async () => {
            const productMock = {
                title: "Laptop ABC",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            }
            const { statusCode, body } = await requester.post('/api/products').send(productMock)
            expect(statusCode).to.equal(201)
            expect(body.payload).to.have.property('_id')
        })

        it('El endpoint GET /api/products debe traer todos los produtos paginados correctamente', async () => {
            const { statusCode, _body } = await requester.get('/api/products')
            expect(statusCode).to.equal(200)
            expect(_body).to.have.property('status', 'success');
        })

        it('El endpoint PUT /api/products debe actualizar un producto correctamente', async () => {
            // Paso 1: Iniciar sesión y obtener las cookies (token)
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            // Extraer las cookies de la respuesta
            const cookies = loginResponse.headers['set-cookie'];
        
            // Buscar el token dentro de las cookies
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Paso 2: Crear un producto para actualizar
            const productMock = {
                title: "Laptop ABC",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            };
        
            const product = await requester.post('/api/products').send(productMock);
            const productId = product.body.payload._id;
        
            // Paso 3: Actualizar el producto pasando la cookie del token en la solicitud
            const updateData = { title: "Laptop Actualizado" };
            const updateProduct = await requester
                .put(`/api/products/${productId}`)
                .set('Cookie', `token=${token}`) // Pasar el token en la cookie
                .send(updateData);
        
            // Paso 4: Verificar que el producto se actualizó correctamente
            expect(updateProduct.body.payload).to.have.property('title', 'Laptop Actualizado');
        })

        it('El endpoint DELETE /api/products/:id debe eliminar un producto correctamente', async () => {
            // Paso 1: Iniciar sesión y obtener las cookies (token)
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            // Extraer las cookies de la respuesta
            const cookies = loginResponse.headers['set-cookie'];
        
            // Buscar el token dentro de las cookies
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
            expect(token).to.be.a('string');
        
            // Paso 2: Crear un producto para eliminar
            const productMock = {
                title: "Laptop ABC",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            };
        
            const product = await requester.post('/api/products').send(productMock);
            const productId = product.body.payload._id;

            // Paso 3: Eliminar el producto pasando la cookie del token en la solicitud
            const deleteResponse = await requester
                .delete(`/api/products/${productId}`)
                .set('Cookie', `token=${token}`) // Pasar el token en la cookie
                .send();
    
            // Paso 4: Verificar que el producto se eliminó correctamente
            expect(deleteResponse.status).to.equal(200);

        });        
    })

    describe('Test de Usuarios', () => {

        it('El endpoint POST /api/users debe crear un usuario solo siendo admin', async () => {
            // Iniciar sesión con el administrador
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Crear un nuevo usuario
            const newUser = {
                first_name: "Juan",
                last_name: "Perez",
                email: "juan.perez@example.com",
                password: "password123",
                role: "user" // Puede ser "user" o "admin"
            };
        
            const response = await requester
                .post('/api/users')
                .set('Cookie', `token=${token}`)
                .send(newUser);
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property('email', newUser.email);
        });

        it('El endpoint GET /api/users debe obtener todos los usuarios, solo siendo admin', async () => {
            // Iniciar sesión con el administrador
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Obtener todos los usuarios
            const response = await requester
                .get('/api/users')
                .set('Cookie', `token=${token}`);
        
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.be.an('array');
            expect(response.body.payload).to.have.length.greaterThan(0);
        });

        it('El endpoint GET /api/users/:id debe obtener el usuario pasado por id, solo siendo admin', async () => {
            // Iniciar sesión con el administrador
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Crear un nuevo usuario para obtenerlo
            const newUser = {
                first_name: "Carlos",
                last_name: "Lopez",
                email: "carlos.lopez@example.com",
                password: "password123",
                role: "user"
            };
            const createUserResponse = await requester
                .post('/api/users')
                .set('Cookie', `token=${token}`)
                .send(newUser);
        
            const userId = createUserResponse.body.payload._id;
        
            // Obtener el usuario por ID
            const response = await requester
                .get(`/api/users/${userId}`)
                .set('Cookie', `token=${token}`);
        
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property('email', newUser.email);
        });

        it('El endpoint PUT /api/users/:id debe actualizar un usuario, solo siendo admin', async () => {
            // Iniciar sesión con el administrador
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Crear un nuevo usuario para actualizarlo
            const newUser = {
                first_name: "Maria",
                last_name: "Gomez",
                email: "maria.gomez@example.com",
                password: "password123",
                role: "user"
            };
            const createUserResponse = await requester
                .post('/api/users')
                .set('Cookie', `token=${token}`)
                .send(newUser);
        
            const userId = createUserResponse.body.payload._id;
        
            // Actualizar el usuario
            const updateData = { first_name: "Mariana" };
            const response = await requester
                .put(`/api/users/${userId}`)
                .set('Cookie', `token=${token}`)
                .send(updateData);
        
            expect(response.status).to.equal(200);
            expect(response.body.payload).to.have.property('first_name', 'Mariana');
        });

        it('El endpoint DELETE /api/users/:id debe eliminar el usuario pasado por parametro, solo siendo admin', async () => {
            // Iniciar sesión con el administrador
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });
        
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
        
            // Crear un nuevo usuario para eliminarlo
            const newUser = {
                first_name: "Luis",
                last_name: "Ramirez",
                email: "luis.ramirez@example.com",
                password: "password123",
                role: "user"
            };
            const createUserResponse = await requester
                .post('/api/users')
                .set('Cookie', `token=${token}`)
                .send(newUser);
        
            const userId = createUserResponse.body.payload._id;
        
            // Eliminar el usuario
            const response = await requester
                .delete(`/api/users/${userId}`)
                .set('Cookie', `token=${token}`);
        
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('Usuario eliminado');
        });
    })

    describe('Test de Carrito', () => {
        let cookie
        
        it('El endpoint GET /api/carts/:id debe obtener el carrito, siendo un usuario logueado', async () => {
            // Iniciar sesión con el usuario
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            });

            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];

            const newUser = {
                first_name: "Juan",
                last_name: "Perez",
                email: "juanperez@example.com",
                password: "password123",
                role: "user" // Puede ser "user" o "admin"
            };

            const response1 = await requester
                .post('/api/users')
                .set('Cookie', `token=${token}`)
                .send(newUser);
                
            // Obtener el carrito
            const cartId = response1._body.payload.cart; // Aquí debes usar el ID del carrito que quieras probar
            const response = await requester
                .get(`/api/carts/${cartId}`)
                .set('Cookie', `token=${token}`);

            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
        });
    
        it('El endpoint PUT /api/carts/:id debe actualizar los productos de un carrito, solo siendo un usuario logueado', async () => {
            const login = {
                email:"nicolasgemignani@outlook.com",
                password:"123456"
            }
            const logueado = await requester.post('/api/sessions/login').send(login)
            const cookieResult = logueado.headers['set-cookie'][0]
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }

            const productMock = [{
                title: "Laptop ABC",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            },{
                title: "Laptop ABCDE",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456312",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            }]
            const product = await requester.post('/api/products').send(productMock);

            const product1 = product._body.payload[0]; // Primer producto
            const product2 = product._body.payload[1];

    
            // Iniciar sesión con el usuario
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "carlos.lopez@example.com",
                password: "password123"
            });

            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];

            const cid = '67a66761b5bbc4108e4fd255'

            // Obtener el carrito del usuario
            const cartResponse = await requester
                .get(`/api/carts/${cid}`)  // Asumimos que esta ruta obtiene el carrito del usuario autenticado
                .set('Cookie', `token=${token}`);
            const cartId = cartResponse.body.payload._id;

            // Preparar los productos a agregar al carrito
            const productsToUpdate = [
                { product: product1._id, quantity: 2 },
                { product: product2._id, quantity: 5 }
            ];

            // Actualizar el carrito
            const response = await requester
                .put(`/api/carts/${cartId}`)
                .set('Cookie', `token=${token}`)
                .send(productsToUpdate);

    
            // Verificar la respuesta
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.products).to.have.lengthOf(2);  // Asegúrate de que los productos fueron actualizados correctamente
            expect(response.body.payload.products[0].quantity).to.equal(2);  // Verificar la cantidad del primer producto
        });
    
        it('El endpoint DELETE /api/carts/:id debe vaciar el carrito, solo siendo un usuario logueado', async () => {
            // Iniciar sesión con un usuario
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "carlos.lopez@example.com",
                password: "password123"
            });

            // Extraer la cookie de autenticación
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];

            const cartId = '67a66761b5bbc4108e4fd255' 

            // Enviar petición DELETE para vaciar el carrito
            const response = await requester
                .delete(`/api/carts/${cartId}`)
                .set('Cookie', `token=${token}`);
    
            // Verificar la respuesta
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
        });
    
        it('El endpoint DELETE /api/carts/remove/:id debe eliminar el carrito, solo siendo un usuario logueado', async () => {
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "maria.gomez@example.com",
                password: "password123"
            });

            // Extraer la cookie de autenticación
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];

            const cartId = '67a66762b5bbc4108e4fd25f' 

            const response = await requester
                .delete(`/api/carts/remove/${cartId}`)
                .set('Cookie', `token=${token}`);
            // Verificar que la respuesta sea exitosa
            expect(response.status).to.equal(200);
        });
    
        it('El endpoint PUT /api/carts/:cid/product/:pid debe actualizar la cantidad de un producto, solo siendo un usuario logueado', async () => {
            // 1. Iniciar sesión con el usuario
            const login = {
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            };
            const logueado = await requester.post('/api/sessions/login').send(login);
            const cookieResult = logueado.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            };
            
            // 2. Crear productos para agregar al carrito
            const productMock = [{
                title: "Laptop ABC",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT456322",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            },{
                title: "Laptop ABCDE",
                description: "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
                code: "LT4563122",
                price: 899.99,
                status: true,
                stock: 30,
                category: "Computers",
                thumbnail: "https://example.com/images/lt456.jpg"
            }];
            
            const product = await requester.post('/api/products').send(productMock);

            const product1 = product._body.payload[0];  // Primer producto
            const product2 = product._body.payload[1];  // Segundo producto

            // Iniciar sesión con el usuario
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "carlos.lopez@example.com",
                password: "password123"
            });

            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];

            const cid = '67a66761b5bbc4108e4fd255'
        
            // 3. Obtener carrito del usuario logueado
            const cartResponse = await requester
                .get(`/api/carts/${cid}`)  // Asegúrate de usar un cartId válido
                .set('Cookie', `token=${token}`);

            const cartId = cartResponse.body.payload._id;
            
            // 4. Preparar productos a actualizar
            const productsToUpdate = [
                { product: product1._id, quantity: 5 },
                { product: product2._id, quantity: 3 }
            ];

            const add = await requester
                .put(`/api/carts/${cartId}`)
                .set('Cookie', `token=${token}`)
                .send(productsToUpdate);

            // 5. Actualizar la cantidad de productos en el carrito
            const response = await requester
                .put(`/api/carts/${cartId}/product/${product1._id}`)
                .set('Cookie', `token=${token}`)
                .send({ quantity: 2 });  // Se actualiza solo el primer producto

            // Actualizar el carrito
            const response2 = await requester
                .put(`/api/carts/${cartId}`)
                .set('Cookie', `token=${token}`)
                .send(productsToUpdate);

            // 6. Verificar la respuesta
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.payload.products).to.have.lengthOf(2);  // Verificar que el carrito tenga 2 productos
            expect(response.body.payload.products[0].quantity).to.equal(2);  // Verificar que la cantidad del primer producto es 2
        
            // 7. Verificar que la cantidad del segundo producto sigue siendo la misma
            expect(response.body.payload.products[1].quantity).to.equal(3);  // Verificar que la cantidad del segundo producto es 3
        });
    
        it('El endpoint DELETE /api/carts/:cid/products/:pid debe eliminar un producto del carrito, solo siendo un usuario logueado', async () => {
            

            // 1. Iniciar sesión con el usuario
            const login = {
                email: "nicolasgemignani@outlook.com",
                password: "123456"
            };
            const logueado = await requester.post('/api/sessions/login').send(login);
            const cookieResult = logueado.headers['set-cookie'][0];
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            };            

            const newUser = {
                first_name: "Juan",
                last_name: "Perez",
                email: "juanperezzz@example.com",
                password: "password123",
                role: "user" // Puede ser "user" o "admin"
            };

            const response1 = await requester
                .post('/api/users')
                .set('Cookie', `${cookie.name}=${cookie.value}`)
                .send(newUser);

            const cartId = response1._body.payload.cart

            // Iniciar sesión con el usuario
            const loginResponse = await requester.post('/api/sessions/login').send({
                email: "juanperezzz@example.com",
                password: "password123"
            });
            
            const cookies = loginResponse.headers['set-cookie'];
            const token = cookies.find(cookie => cookie.startsWith('token=')).split(';')[0].split('=')[1];
            
        
            const productMock = {
                title: "Teclado Mecánico XYZ",
                description: "Teclado mecánico con switches rojos y retroiluminación RGB.",
                code: "TK123",
                price: 79.99,
                status: true,
                stock: 40,
                category: "Peripherals",
                thumbnail: "https://example.com/images/tk123.jpg"
            };

            const productResponse = await requester.post('/api/products').send(productMock);
            const product = productResponse._body.payload; // Producto creado


            // 3. Agregar el producto al carrito
            const addResponse = await requester
                .post(`/api/carts/${cartId}/product/${product._id}`)
                .set('Cookie', `token=${token}`)
                .send({ quantity: 1 });

        
            // 4. Eliminar el producto del carrito
            const deleteResponse = await requester
                .delete(`/api/carts/${cartId}/products/${product._id}`)
                .set('Cookie', `${cookie.name}=${cookie.value}`);
        
            // 5. Verificar la respuesta
            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse.body.status).to.equal('success');
        });
    })
})