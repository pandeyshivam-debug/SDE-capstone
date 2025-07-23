import express from "express"
import cors from "cors"
import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"
import authRoutes from "./routes/auth.routes.js"
import errorHandler from "./middleware/error.middleware.js"
import fileRoutes from "./routes/file.routes.js"

const app = express()

app.use(cors())
app.use(express.json())

const swaggerDocument = YAML.load('./openapi.yaml')

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/api/auth', authRoutes)
app.use('/api/files', fileRoutes)

app.use(errorHandler)

export default app
