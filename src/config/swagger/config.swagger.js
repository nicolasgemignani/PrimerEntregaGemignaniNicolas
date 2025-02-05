import swaggerJSDoc from "swagger-jsdoc";
import __dirname from '../../utils/dirname.js'

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentacion por swagger",
            description:"Documentacion creada por swagger",
            version:"1.0.0"
        }
    },
    apis:[`${__dirname}/../docs/**/*.yaml`]
}

export const specs = swaggerJSDoc(swaggerOptions)