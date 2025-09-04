import { useParams } from "react-router-dom"
import { TaskPageData ,UpdateTask,DeleteTask,updateSubtask, startTimer, stopTimer, getTimeLogs} from "../../redux/action"
import { useDispatch,useSelector } from "react-redux"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import Cookies from "js-cookie"
import { useEffect ,useState} from "react"
import { Sidebar } from "../Sidebar/sidebar";
import "./task.css"
import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";
import { removeTask } from '../../redux/action';
import CircularProgress from '@mui/material/CircularProgress';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export const Taskpage=()=>{
    const id=useParams().id
    const token=Cookies.get("Token")
    const dispatch=useDispatch()
    const Tasks=useSelector(store=>store.tasks)
    const navigate=useNavigate()
    const [status, setstatus] = useState('all');
    const [timeLogs, setTimeLogs] = useState({});
    const [activeTimers, setActiveTimers] = useState(new Set());
    const [currentTimes, setCurrentTimes] = useState({});
    
    const handleChange = (event) => {
         dispatch(removeTask())
         setstatus(event.target.value);
       };

    // Timer functions
    const handleStartTimer = async (taskId) => {
        await dispatch(startTimer(taskId));
        setActiveTimers(prev => new Set([...prev, taskId]));
        // Refresh time logs and initialize current time
        const logs = await dispatch(getTimeLogs(taskId));
        if (logs) {
            setTimeLogs(prev => ({...prev, [taskId]: logs}));
            setCurrentTimes(prev => ({...prev, [taskId]: logs.totalMs || 0}));
        }
    };

    const handleStopTimer = async (taskId) => {
        await dispatch(stopTimer(taskId));
        setActiveTimers(prev => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
        });
        // Refresh time logs
        const logs = await dispatch(getTimeLogs(taskId));
        if (logs) {
            setTimeLogs(prev => ({...prev, [taskId]: logs}));
        }
    };

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Handle task completion
    const handleCompleteTask = async (taskId) => {
        try {
            // Stop timer if running
            if (activeTimers.has(taskId)) {
                await dispatch(stopTimer(taskId));
                setActiveTimers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(taskId);
                    return newSet;
                });
            }
            
            // Mark task as completed
            const data = { status: "completed" };
            await dispatch(UpdateTask(taskId, status, token, id, data));
            
            // Refresh time logs
            const logs = await dispatch(getTimeLogs(taskId));
            if (logs) {
                setTimeLogs(prev => ({...prev, [taskId]: logs}));
            }
            
            // Clear current tasks to force refresh
            dispatch(removeTask());
            
            // Refresh task list to show updated status
            setTimeout(() => {
                dispatch(TaskPageData(token, id, status));
            }, 100);
            
        } catch (error) {
            console.error('Error completing task:', error);
            alert('Failed to complete task. Please try again.');
        }
    };
    useEffect(()=>{
        if(token===undefined) navigate("/") 
        else if(Tasks===undefined ) dispatch(TaskPageData(token,id,status))
      },[id,Tasks])

    // Load time logs when tasks are loaded
    useEffect(() => {
        if (Tasks && Tasks.length > 0) {
            Tasks.forEach(async (task) => {
                const logs = await dispatch(getTimeLogs(task._id));
                if (logs) {
                    setTimeLogs(prev => ({...prev, [task._id]: logs}));
                    // Initialize current time for active timers
                    if (activeTimers.has(task._id)) {
                        setCurrentTimes(prev => ({...prev, [task._id]: logs.totalMs || 0}));
                    }
                }
            });
        }
    }, [Tasks, dispatch]);

    // Dynamic timer effect - updates every second for active timers
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTimes(prev => {
                const newTimes = {...prev};
                activeTimers.forEach(taskId => {
                    newTimes[taskId] = (newTimes[taskId] || 0) + 1000; // Add 1 second
                });
                return newTimes;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [activeTimers]);

   return (<div className="PagesOuterSideDiv">
              <div style={{width:'10%',marginRight:'10px'}}>
                     <Sidebar/>   
              </div>
          <div style={{width:'85%'}}>
                     <div className="Sort_Div">
                <FormControl sx={{width:"200px",margin:2,  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;'}}>
                     <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                     <Select labelId="demo-simple-select-label" id="demo-simple-select" value={status} label="Status" onChange={handleChange} >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                     </Select>
                </FormControl><br></br>
               <Chip sx={{backgroundColor:'rgb(25,118,210)', color:"white", margin:1.5,fontWeight:'bold'}} label={`${id.toUpperCase()}-TASKS`} variant="outlined" /><br></br>
               {Tasks!==undefined?Tasks.length!==0?<div className="PagesMainDiv">
                 {Tasks.map((ele)=>{
                    return <div className="pagesTaskDiv" key={ele._id}>
                                 <Chip sx={{backgroundColor:'rgb(25,118,210)', color:"white", marginTop:1.4}} avatar={<Avatar alt={ele.tag} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThu7m6UZ6dq-GqGoHo7xGlw-TIwXdx4eB0eg&usqp=CAU' />}label={ele.tag.toUpperCase()}variant="outlined"/>
                                 {ele.status==="Completed"? <Chip sx={{backgroundColor:'#4caf50', color:"white", marginTop:1.4,fontWeight:'bold'}} label={ele.status.toUpperCase()} variant="outlined"/>: 
                                  ele.status==="In Progress"? <Chip sx={{backgroundColor:'#ff9800', color:"white", marginTop:1.4,fontWeight:'bold'}} label={ele.status.toUpperCase()} variant="outlined"/>:
                                  <Chip sx={{backgroundColor:'red', color:"white", marginTop:1.4,fontWeight:'bold'}} label={ele.status.toUpperCase()} variant="outlined" />}
                                 <h6 className="Date">Date: {ele.date.split("-").reverse().join("-")}</h6>
                                 <p className="Headings">Task Title:</p>
                                 <p className="TaskTitle">{ele.title}</p>
                                 <p className="Headings">Description:</p>
                                 <p className="TaskTitle">{ele.description}</p>
                                <div>
                                     <p className="Headings">Subtasks:</p>
                                                 {ele.subtasks.map((e)=>{
                                                     return <div className="PagesSubDiv" key={e._id}>
                                                                                                                    {e.status==="Completed" ? <input onChange={()=>{
                                                              var data
                                                                if(e.status==="Pending"){
                                                                        data={title:e.title,
                                                                              status:"completed"}
                                                                 }
                                                                else{
                                                                    data={ title:e.title,
                                                                          status:"pending"}
                                                                 }
                                                               dispatch(updateSubtask(ele._id,e._id,status,token,id,data))
                                                          }} type="checkbox" checked/>:<input onChange={()=>{
                                                              var data
                                                                if(e.status==="Pending"){
                                                                    data={title:e.title,
                                                                          status:"completed"}
                                                                 }
                                                                 else{
                                                                     data={title:e.title,
                                                                          status:"pending"}
                                                                 }
                                                              dispatch(updateSubtask(ele._id,e._id,status,token,id,data))
                                                          }} type="checkbox"/>}
                                                          <p style={{fontSize:'15px', margin:0}}>{e.title}</p>
                                                     </div>
                                                 })}
                                    </div>

                            <Button onClick={async ()=>{
                                try {
                                    var data
                                    if(ele.status==="Pending"){
                                        data={status:"completed"}
                                    }
                                    else{
                                        data={status:"pending"}
                                    }
                                    await dispatch(UpdateTask(ele._id,status,token,id,data));
                                    // Clear current tasks to force refresh
                                    dispatch(removeTask());
                                    // Refresh task list
                                    setTimeout(() => {
                                        dispatch(TaskPageData(token, id, status));
                                    }, 100);
                                } catch (error) {
                                    console.error('Error updating task:', error);
                                    alert('Failed to update task. Please try again.');
                                }
                            }} sx={{margin:1,fontSize:12,fontWeight:'bold'}} variant="contained">{ele.status==="Pending"?"Mark Completed":"Mark Pending"}</Button>
                           
                           {/* Completed Button - permanently stops timer and marks as completed */}
                           <Button onClick={()=>{
                               handleCompleteTask(ele._id)
                            }} sx={{margin:1,fontSize:12,fontWeight:'bold', backgroundColor: '#4caf50'}} variant="contained">
                               Complete Task
                           </Button>
                           
                           <Button onClick={async ()=>{
                               try {
                                   await dispatch(DeleteTask(ele._id,status,token,id));
                                   // Clear current tasks to force refresh
                                   dispatch(removeTask());
                                   // Refresh task list
                                   setTimeout(() => {
                                       dispatch(TaskPageData(token, id, status));
                                   }, 100);
                               } catch (error) {
                                   console.error('Error deleting task:', error);
                                   alert('Failed to delete task. Please try again.');
                               }
                            }} sx={{margin:1,fontSize:12,fontWeight:'bold'}} variant="contained">Delete</Button>
                           
                           {/* Timer Section */}
                           <div style={{marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px'}}>
                               <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                   <AccessTimeIcon sx={{marginRight: '5px', color: '#1976d2'}} />
                                   <span style={{fontWeight: 'bold', fontSize: '14px'}}>Time Tracking</span>
                               </div>
                               
                               {/* Timer Buttons */}
                               <div style={{marginBottom: '10px'}}>
                                   {!activeTimers.has(ele._id) ? (
                                       <Button 
                                           onClick={() => handleStartTimer(ele._id)}
                                           startIcon={<PlayArrowIcon />}
                                           variant="contained"
                                           size="small"
                                           sx={{margin: '2px', backgroundColor: '#4caf50'}}
                                       >
                                           Start Timer
                                       </Button>
                                   ) : (
                                       <Button 
                                           onClick={() => handleStopTimer(ele._id)}
                                           startIcon={<StopIcon />}
                                           variant="contained"
                                           size="small"
                                           sx={{margin: '2px', backgroundColor: '#f44336'}}
                                       >
                                           Stop Timer
                                       </Button>
                                   )}
                               </div>
                               
                               {/* Time Display */}
                               {timeLogs[ele._id] && (
                                   <div style={{fontSize: '12px', color: '#666'}}>
                                       <div style={{fontSize: '14px', fontWeight: 'bold', color: activeTimers.has(ele._id) ? '#4caf50' : '#666'}}>
                                           <strong>Total Time:</strong> {formatTime(activeTimers.has(ele._id) ? (currentTimes[ele._id] || 0) : (timeLogs[ele._id].totalMs || 0))}
                                           {activeTimers.has(ele._id) && <span style={{color: '#4caf50', marginLeft: '5px'}}>⏱️</span>}
                                       </div>
                                       {timeLogs[ele._id].data && timeLogs[ele._id].data.length > 0 && (
                                           <div style={{marginTop: '5px'}}>
                                               <strong>Recent Sessions:</strong>
                                               {timeLogs[ele._id].data.slice(0, 3).map((log, idx) => (
                                                   <div key={idx} style={{fontSize: '11px', marginLeft: '10px'}}>
                                                       {new Date(log.startTime).toLocaleString()} - 
                                                       {log.endTime ? new Date(log.endTime).toLocaleString() : 'Running...'}
                                                   </div>
                                               ))}
                                           </div>
                                       )}
                                   </div>
                               )}
                           </div>
                   </div>
                })}
    </div>: <div className="Gif">
           <img src="https://i.pinimg.com/originals/54/9c/da/549cda1af3271de62a61bce0dc9309e8.gif" alt="Empty"/>
          <h1>Empty</h1>
     </div>:<div style={{width:'100%',textAlign:'center',marginTop:'50px'}}><CircularProgress  color="success" /></div>}
    </div>
    </div>
    </div>)
}