const mongoose=require("mongoose")

const timeLogSchema=new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"task",
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    startTime:{type:Date, required:true},
    endTime:{type:Date, required:false, default:null}
},{
    timestamps:true
})

const TimeLog=mongoose.model("timelog",timeLogSchema)
module.exports=TimeLog


