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
      'https://mytask-managerapp.herokuapp.com'
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

app.use("/task",taskController)


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