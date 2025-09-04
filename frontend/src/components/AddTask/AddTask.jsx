import TextField from '@mui/material/TextField';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState,useRef} from 'react';
import { AddTasktoBackend, generateAISuggestions, clearAISuggestions } from '../../redux/action';
import Cookies from 'js-cookie';
import { Sidebar } from '../Sidebar/sidebar';
import { useNavigate } from 'react-router-dom';
import "./AddTask.css"

export const AddTask=()=>{
    const dispatch=useDispatch()
    const token=Cookies.get("Token")
    const Input1=useRef(null)
    const Input2=useRef(null)
    const Input3=useRef(null)
    const Input4=useRef(null)
    const AIInput=useRef(null)

    const [Tag, setTag] =useState('');
    const navigate=useNavigate()
    const [taskData,setTaskData]=useState({
        title:"",
        description:"",
        tag:"",
        subtasks:[],
        date:""
        
    })
    
    // AI State
    const [aiInput, setAiInput] = useState('');
    const aiState = useSelector(store => store.ai)
    useEffect(()=>{
      if(token===undefined){
         navigate("/")
      }
    
    },[])

    const [subtask,setSubtask]=useState({
        title:""
      
    })
   const updateTaskData=(target)=>{
             setTaskData({
                ...taskData,
                [target.id]:target.value
             })
   }
  const handleChange = (event) => {
   
    setTaskData({
        ...taskData,
        tag:event.target.value
    })

    setTag(event.target.value);
  };

  // AI Functions
  const handleAIGenerate = () => {
    if (aiInput.trim().length >= 3) {
      dispatch(generateAISuggestions(aiInput.trim()));
    } else {
      alert('Please enter at least 3 characters for AI generation');
    }
  };

  const handleUseAISuggestion = (suggestion) => {
    setTaskData({
      ...taskData,
      title: suggestion.title,
      description: suggestion.description
    });
    
    // Clear the input fields
    if (Input1.current) Input1.current.value = suggestion.title;
    if (Input2.current) Input2.current.value = suggestion.description;
    
    // Clear AI suggestions
    dispatch(clearAISuggestions());
    setAiInput('');
    if (AIInput.current) AIInput.current.value = '';
  };

  const handleClearAI = () => {
    dispatch(clearAISuggestions());
    setAiInput('');
    if (AIInput.current) AIInput.current.value = '';
  };
    return (<div className="PagesOuterSideDiv">
    <div style={{width:'10%',marginRight:'10px'}}>
        <Sidebar/>
    </div>
    
    <div style={{width:'85%',textAlign:'center'}}>
     <div className='AddtaskDiv'>
    
        {/* AI Input Section */}
        <form className='AddTaskForm'>
        <Button variant="text" sx={{fontWeight:'bold'}} startIcon={<AutoAwesomeIcon />}>AI Task Generator</Button>
        <TextField 
          inputRef={AIInput}
          onChange={(e) => setAiInput(e.target.value)}
          sx={{margin:2, width:280}} 
          label="Describe your task in natural language" 
          placeholder="e.g., follow up with designer, review project proposal"
          multiline 
          rows={2}
        />
        <div style={{margin: '10px 0'}}>
          <Button 
            onClick={handleAIGenerate}
            disabled={aiState.loading || aiInput.trim().length < 3}
            variant="contained" 
            startIcon={aiState.loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
            sx={{margin:1}}
          >
            {aiState.loading ? 'Generating...' : 'Generate with AI'}
          </Button>
          {aiState.suggestions && (
            <Button 
              onClick={handleClearAI}
              variant="outlined" 
              startIcon={<CloseIcon />}
              sx={{margin:1}}
            >
              Clear
            </Button>
          )}
        </div>
        
        {/* AI Suggestions Display */}
        {aiState.error && (
          <Card sx={{margin:2, backgroundColor:'#ffebee'}}>
            <CardContent>
              <Typography color="error" variant="body2">
                {aiState.error}
              </Typography>
            </CardContent>
          </Card>
        )}
        
        {aiState.suggestions && (
          <Card sx={{margin:2, backgroundColor:'#e8f5e8', border:'2px solid #4caf50'}}>
            <CardContent>
              <Typography variant="h6" sx={{fontWeight:'bold', marginBottom:2}}>
                🤖 AI Suggestions
              </Typography>
              <Typography variant="subtitle1" sx={{fontWeight:'bold'}}>
                Title: {aiState.suggestions.title}
              </Typography>
              <Typography variant="body2" sx={{marginBottom:2}}>
                Description: {aiState.suggestions.description}
              </Typography>
              <Button 
                onClick={() => handleUseAISuggestion(aiState.suggestions)}
                variant="contained" 
                startIcon={<CheckIcon />}
                sx={{backgroundColor:'#4caf50'}}
              >
                Use This Suggestion
              </Button>
            </CardContent>
          </Card>
        )}
        </form>

        <form className='AddTaskForm'>
        <Button variant="text" sx={{fontWeight:'bold'}} >Task Details</Button>
                <TextField inputRef={Input1} onChange={(e)=>updateTaskData(e.target)} id="title" sx={{margin:2}}  label="Task Title" variant="outlined" /><br></br>
                <TextField inputRef={Input2} onChange={(e)=>updateTaskData(e.target)} sx={{margin:2,width:225}}  id="description" label="Description" multiline rows={4} /><br></br>

              
      <FormControl sx={{width:225}}>
        <InputLabel id="demo-simple-select-label">Tag</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="tag"
          value={Tag}
          label="Tag"
          onChange={handleChange}
        >
          <MenuItem id='tag'  value='personal'>Personal</MenuItem>
          <MenuItem  value='official'>Official</MenuItem>
          <MenuItem  value='others'>Others</MenuItem>
        </Select>
      </FormControl>
  
        
        </form>
      
        <form className='AddTaskForm'>
                 <Button variant="text" sx={{fontWeight:'bold'}} >Add Subtasks</Button>
                <TextField inputRef={Input3} onChange={(e)=>setSubtask({...subtask,title:e.target.value})} sx={{marginTop:2.5}}  label="Title" variant="outlined" />
                <Button onClick={()=>{
                    if(subtask.title!==""){
                        setTaskData({...taskData,subtasks:[...taskData.subtasks,subtask]})
                    }
                }} sx={{marginTop:1.5}} ><AddBoxIcon sx={{color:'rgb(25,118,210)',fontSize: 55 }}/></Button><br></br>
             <hr></hr>
                <div className='subTaskMainDiv'>
                 
                    { taskData.subtasks.length!==0?taskData.subtasks.map((ele,index)=>{
                            return (<div key={index} className='subTaskDiv'>
                                     <p>{ele.title}</p>
                                     <Button onClick={()=>{
                                        let data=[...taskData.subtasks].filter((ele,idx)=>{
                                                return  idx!==index
                                        })
                                        setTaskData({...taskData,subtasks:data})
                                     }} ><DeleteForeverIcon sx={{color:'white'}}/> </Button>   
                           </div> )
                        }):null
                    }
                </div>
        </form>

        <form className='AddTaskForm'>
        <Button variant="text" sx={{fontWeight:'bold',width:'10px'}} >Date</Button>:<input ref={Input4} style={{margin:'20px'}} onChange={(e)=>setTaskData({...taskData,date:e.target.value})} type="date" /><br></br>
               <Button onClick={(e)=>{
                     e.preventDefault()
                     let token=Cookies.get("Token")
                     dispatch(AddTasktoBackend(token,taskData))
                    Input1.current.value=""
                    Input2.current.value=""
                    Input3.current.value=""
                    Input4.current.value=""
                    setTaskData({...taskData,subtasks:[]})
                    setTag('')
               }} variant="contained">Add Task</Button>
               
        </form>

        </div>
        </div>
        </div>
    )
}

