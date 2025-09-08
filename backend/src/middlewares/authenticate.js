const jwt = require('jsonwebtoken');
require('dotenv').config()


const verifyToken=(token)=>{
return jwt.verify(token,process.env.JWT_SECRET)
}



const authenticate=async(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).send({message:"Authorization header missing"})
    }
    if(!req.headers.authorization.startsWith("Bearer ")){
        return res.status(401).send({message:"Bearer token missing"})

    }
    const token=req.headers.authorization.trim().split(" ")[1]
    console.log("Auth header:", req.headers.authorization); //for testing

    let decoded
   try {
       decoded=await verifyToken(token)
      if(decoded){
          req.id=decoded.userId
          
        return next()
      }
      else{
          return res.status(401).send({message:"Invalid token"})
      }
   } 
   catch (error) {
       return res.status(401).send({message:"Invalid or expired token"})
   }
}
module.exports=authenticate