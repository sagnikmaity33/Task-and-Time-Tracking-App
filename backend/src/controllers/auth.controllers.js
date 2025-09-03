const User=require("../models/user.model")
const jwt = require('jsonwebtoken')
const {validationResult} = require("express-validator")
require('dotenv').config()

const generateToken=(user)=>{
    const jwtSecret = process.env.JWT_SECRET
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'
    return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: jwtExpiresIn })
}




const register=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        let user=await User.findOne({email:{$eq:req.body.email}})
        if(user){
            return res.status(400).send({message:"email id already registered"})
        }
        user=await User.create(req.body)
        let token=generateToken(user)
        return res.status(200).send({Name:user.name,Token:token,message:"success"})
        
    } 
    catch (error) {
        return res.status(400).send(error.message)
    }
}

const login=async(req,res)=>{
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ message: errors.array() });
        }
    
        let user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(400).send({message:"email id not registered"})

        }
        const match=user.checkpassword(req.body.password)
 
        if(match){
           let token=generateToken(user)

           return res.status(200).send({Name:user.name,Token:token,message:"success"})
        }

  return res.status(400).send({message:"incorrect password"})
        
    
} 
    catch (error) {
        return res.status(400).send(error.message)
    }
}



module.exports={register,login}