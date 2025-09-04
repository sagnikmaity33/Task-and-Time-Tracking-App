const express=require("express")
const app=express()
const { register, login } = require("./controllers/auth.controllers");
const { body, validationResult } = require("express-validator");
const authenticate=require("./middlewares/authenticate")
var cors = require('cors')

// Configure CORS properly for both development and production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'https://task-and-time-tracking-app-mj19.vercel.app',
      
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // For production, you might want to be more restrictive
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed by CORS'));
      } else {
        callback(null, true); // Allow in development
      }
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}

app.use(cors(corsOptions))
app.use(express.json())



const taskController=require("./controllers/task.controller")
const timeController=require("./controllers/time.controller")
const aiController=require("./controllers/ai.controller")

app.use("/task",taskController)
app.use("/time",timeController)
app.use("/ai",aiController)

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0"
    });
});

// Detailed health check endpoint
app.get("/health/detailed", async (req, res) => {
    try {
        const mongoose = require("mongoose");
        const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
        
        res.status(200).json({
            status: "OK",
            message: "Server is running with detailed status",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
            database: {
                status: dbStatus,
                connectionState: mongoose.connection.readyState
            },
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB"
            },
            services: {
                ai: process.env.GEMINI_API_KEY ? "configured" : "not configured",
                jwt: process.env.JWT_SECRET ? "configured" : "not configured"
            }
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Health check failed",
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.post(
    "/register",
    body("name").notEmpty().withMessage("name is required"),
    body("mobile").notEmpty().withMessage("mobile no is required"),
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("enter correct email id"),
    body("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 5, max: 8 })
      .withMessage(
        "password should be min 5 letters long and max 8 letters long"
      ),
    register
  );
  app.post(
    "/login",
    body("email")
      .notEmpty()
      .withMessage("email id is required")
      .isEmail()
      .withMessage("incorrect email"),
    body("password").notEmpty().withMessage("password is required"),
    login
  );
module.exports=app