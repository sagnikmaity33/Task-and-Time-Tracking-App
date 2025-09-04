const express=require("express")
const authenticate=require("../middlewares/authenticate")
const Task=require("../models/task.model")
const router=express.Router()



router.get("/:id",authenticate,async(req,res)=>{
    try {
        const filter=req.query.filter
        let tasks
        if(req.params.id==="all"){
            if(filter==="all"){
                tasks=await Task.find({userId:{$eq:req.id}}).lean().exec()
              return  res.status(200).send({data:tasks,status:"success"})
            }
            else{
                // Convert frontend filter to database status format
                let dbStatus = filter;
                if(filter === "pending") dbStatus = "Pending";
                else if(filter === "completed") dbStatus = "Completed";
                else if(filter === "in-progress") dbStatus = "In Progress";
                
                tasks=await Task.find({userId:{$eq:req.id},status:dbStatus}).lean().exec()
                res.status(200).send({data:tasks,status:"success"})
            }
        }
        else{
            if(filter==="all"){
             tasks=await Task.find({userId:{$eq:req.id},tag:req.params.id}).lean().exec()
             res.status(200).send({data:tasks,status:"success"})
            }
            else{
                // Convert frontend filter to database status format
                let dbStatus = filter;
                if(filter === "pending") dbStatus = "Pending";
                else if(filter === "completed") dbStatus = "Completed";
                else if(filter === "in-progress") dbStatus = "In Progress";
                
                tasks=await Task.find({userId:{$eq:req.id},tag:req.params.id,status:dbStatus}).lean().exec()
                res.status(200).send({data:tasks,status:"success"})
            }
        }
    } 
    catch (error) {
        res.status(500).send({message:error.message})
    }
})


router.post("/addtask",authenticate,async(req,res)=>{
      try {
          req.body.userId=req.id
          const task=await Task.create(req.body)
          res.status(201).send({status:"success", data: task})

      } 
      catch (error) {
          res.status(500).send({message:error.message})
      }
})

router.get("/gettask/auth",authenticate,async(req,res)=>{
    try {
        const All=await Task.count({userId:{$eq:req.id}})||0
        const Personal=await Task.count({userId:{$eq:req.id},tag:"personal"})||0
        const Official=await Task.count({userId:{$eq:req.id},tag:"official"})||0
        const Others=await Task.count({userId:{$eq:req.id},tag:"others"})||0
        res.status(200).send({All:All,Personal:Personal,Official:Official,Others:Others,message:"success"})
    } 
    catch (error) {
        res.status(500).send({message:error})
    }
})

router.patch("/:id",authenticate,async(req,res)=>{
    try {
        // Convert frontend status to database format if status is being updated
        if(req.body.status){
            if(req.body.status === "pending") req.body.status = "Pending";
            else if(req.body.status === "completed") req.body.status = "Completed";
            else if(req.body.status === "in-progress") req.body.status = "In Progress";
        }
        
        const task=await Task.findOneAndUpdate({_id:req.params.id, userId:req.id},req.body)
        if(!task){
            return res.status(404).send({message:"Task not found"})
        }
        res.status(200).send({message:"success"})
    } 
    catch (error) {
        res.status(500).send({message:error.message})
    }
})

router.delete("/:id",authenticate,async(req,res)=>{
    try {
        const task=await Task.findOneAndDelete({_id:req.params.id, userId:req.id})
        if(!task){
            return res.status(404).send({message:"Task not found"})
        }
        res.status(200).send({message:"success"})
    } 
    catch (error) {
        res.status(500).send({message:error.message})
    }
})

router.patch("/:id/:subid",authenticate,async(req,res)=>{
    try {
        // Ensure task belongs to the user
        const taskOwner = await Task.findOne({_id:req.params.id, userId:req.id}).lean().exec()
        if(!taskOwner){
            return res.status(404).send({message:"Task not found"})
        }
        
        // Convert frontend status to database format if status is being updated
        if(req.body.status){
            if(req.body.status === "pending") req.body.status = "Pending";
            else if(req.body.status === "completed") req.body.status = "Completed";
            else if(req.body.status === "in-progress") req.body.status = "In Progress";
        }
        
        await Task.updateOne({_id:req.params.id,"subtasks._id":req.params.subid},{$set:{"subtasks.$":req.body}})
        res.status(200).send({message:"success"})
    } 
    catch (error) {
        res.status(500).send({message:error.message})
    }
})




module.exports=router