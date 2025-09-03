const express=require("express")
const authenticate=require("../middlewares/authenticate")
const TimeLog=require("../models/timelog.model")
const Task=require("../models/task.model")
const router=express.Router()

function getTodayBounds(){
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999)
    return {start, end}
}

router.get("/today", authenticate, async (req,res)=>{
    try{
        const {start, end} = getTodayBounds()
        const logs = await TimeLog.find({
            userId:req.id,
            $or:[
                { startTime: { $lte:end, $gte:start } },
                { endTime: { $exists:true, $ne:null, $lte:end, $gte:start } }
            ]
        }).lean().exec()

        const now = Date.now()
        const totalMs = logs.reduce((sum, l)=>{
            const s = new Date(l.startTime).getTime()
            const e = l.endTime ? new Date(l.endTime).getTime() : now
            // clamp to today window
            const clampedStart = Math.max(s, start.getTime())
            const clampedEnd = Math.min(e, end.getTime())
            const add = Math.max(0, clampedEnd - clampedStart)
            return sum + add
        }, 0)

        const tasksWorkedIds = Array.from(new Set(logs.map(l=>String(l.taskId))))
        const tasksWorked = tasksWorkedIds.length ? await Task.find({_id: {$in: tasksWorkedIds}}).lean().exec() : []
        const completedToday = await Task.count({userId:req.id, status:'Completed', updatedAt: { $gte: start, $lte:end }})
        const inProgress = await Task.count({userId:req.id, status:'In Progress'})
        const pending = await Task.count({userId:req.id, status:'Pending'})

        return res.status(200).send({
            totalMs,
            tasksWorked: tasksWorked.map(t=>({ _id:t._id, title:t.title, tag:t.tag, status:t.status })),
            completedToday,
            inProgress,
            pending
        })
    }catch(err){
        return res.status(500).send({message:err.message})
    }
})

module.exports = router


