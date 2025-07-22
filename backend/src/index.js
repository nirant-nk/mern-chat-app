import dotenv from "dotenv";
dotenv.config();

import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./database/connectDB.js";
import { protectRoute } from "./middlewares/auth.middleware.js";
import authRouter from "./routes/auth.route.js";
import messageRouter from "./routes/message.route.js";
import userRouter from "./routes/user.route.js";


const app = express();
const PORT = process.env.PORT || 5050;

// Middlewares to parse json 
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || '*', // specify client URL in .env for stricter CORS
    credentials: true
}));
app.use(morgan('combined'));  // Logs with detailed format for production
app.use(cookieParser());

// Database Connection
connectDB()
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
        process.exit(1); 
    });

// Production static files serving
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    const clientBuildPath = path.join(__dirname, 'client', 'build');
    app.use(express.static(clientBuildPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(clientBuildPath, 'index.html'));
    });
}


app.get('/', (_, res) => {
    res.json({ status: 'Server is up and running' });
});
app.use('/api/v1/auth', authRouter);

// secured
app.use('/api/v1/user',protectRoute,userRouter);
app.use('/api/v1/chat',protectRoute,messageRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT} in ${process.env.NODE_ENV} mode`);
});