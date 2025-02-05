process.loadEnvFile()

const getEnvVariable = (key, defaultValue) => {
    const value = process.env[key] || defaultValue
    if (!value) {
        throw new Error(`Missing enviroment variable: ${key}`)
    }
    return value
}

export const variables = {
    ENVIROMENT: getEnvVariable('NODE_ENV'),
    PRIVATE_KEY: getEnvVariable('PRIVATE_KEY'),
    PORT: getEnvVariable('PORT'),
    MONGO_URL: getEnvVariable('MONGO_URL'),
    COOKIEPARSER: getEnvVariable('COOKIEPARSER'),
    GMAIL_USER: getEnvVariable('GMAIL_USER'),
    GMAIL_PASS: getEnvVariable('GMAIL_PASS'),
    REFRESH_KEY: getEnvVariable('REFRESH_KEY')
}