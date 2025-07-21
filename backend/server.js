import app from './index.js'
import { config } from 'dotenv'

config()

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`)
})
