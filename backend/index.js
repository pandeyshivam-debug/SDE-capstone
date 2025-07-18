import express from "express"
import cors from "cors"
import authRoutes from "./routes/auth.routes.js"
import errorHandler from "./middleware/error.middleware.js"

const app = express();

app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes);

// Global error handler
app.use(errorHandler);

export default app;
