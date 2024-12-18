import { faker } from '@faker-js/faker'

export const generateMockProducts = (count) => {
    const mockProducts = []
    for ( let i = 0; i < count; i++) {
        mockProducts.push({
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            code: faker.string.uuid(),
            price: parseFloat(faker.commerce.price({min: 1000, max: 100000})),
            status: faker.datatype.boolean(),
            stock: faker.number.int({ min: 0, max: 100}),
            category: faker.commerce.department(),
            thumbnail: faker.image.urlPicsumPhotos(),
        })
    }
    return mockProducts
}

export const generateMockUsers = (count) => {
    const mockUsers = []
    for ( let i = 0; i < count; i++) {
        mockUsers.push({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement(['user']),
            cart: null,
        })
    }
    return mockUsers
}