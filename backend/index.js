import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.routes'

config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/routes', authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`)
})