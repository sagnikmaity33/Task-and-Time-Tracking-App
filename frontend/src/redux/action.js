
// import { Navigate } from "react-router-dom"
import Cookies from 'js-cookie'

// API base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001"

export const ADD_USER="ADD_USER"
export const ADD_TASK="ADD_TASK"
export const RTASK="RTASK"
export const AUTH="AUTH"
export const AI_SUGGESTIONS="AI_SUGGESTIONS"
export const AI_LOADING="AI_LOADING"
export const AI_ERROR="AI_ERROR"
 
const addUser=(data)=>{
    return {
        type:ADD_USER,
        payload:data
    }
}
 
const AddTASKData=(data)=>{
    return {
        type:ADD_TASK,
        payload:data
    }
}
export const removeTask=()=>{
    return {
        type:RTASK,
        payload:undefined
    }
}
 



export const Auth=(data)=>{
    return {
        type:AUTH,
        payload:data
    }
}

export const login=(data,setCookie)=>{
       return async(dispatch,getState,api)=>{
           try {
               const res=await fetch(`${API_BASE_URL}/login`,{
                   method:"POST",
                   body:JSON.stringify(data),
                   headers: {
                    'Content-Type': 'application/json'
                   
                  },
               })
                  const received=await res.json()
                  if(received.Token && received.Name){
                  Cookies.set('Name',`${received.Name}`, { expires: 7 })
                  Cookies.set('Token',`${received.Token}`, { expires: 7 })
                  alert(received.message)
                  dispatch(addUser(received.message))
                  }
                  else{
                    if(received.errors){
                        alert(received.errors[0].msg)
                      }
                    if(received.message[0].msg){
                        alert(received.message[0].msg)
                    }
                    else{
                    alert(received.message)
                    }
                  }
                  
              } 
           catch (error) {
               console.log(error)
           }
       }
           
    
  
}
export const register=(data,setCookie)=>{
    
            return async(dispatch, getState, api) => {
               try {
                const res=await fetch(`${API_BASE_URL}/register`,{
                    method:"POST",
                    body:JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json'
                       
                      },
                })
                const received=await res.json()
                if(received.Token && received.Name){
                Cookies.set('Name',`${received.Name}`, { expires: 7 })
                Cookies.set('Token',`${received.Token}`, { expires: 7 })
                alert(received.message)
                dispatch(addUser(received.message))
                
                }
                else{
                  
                    if(received.errors){
                    alert(received.errors[0].msg)
                  }
                  if(received.message[0].msg){
                      alert(received.message[0].msg)
                  }
                 
                  else{
                  alert(received.message)
                  }
                }
                
               
                
               } catch (error) {
                   console.log(error)
               } 
            }
          
       
     
       
    } 

    export const authenticate=(token)=>{
        return async(dispatch, getState, api) => {
            try {
                 const res=await fetch(`${API_BASE_URL}/task/gettask/auth`,{
                 method:"GET",
                 headers: {
                     'Content-Type': 'application/json',
                     'Authorization': `Bearer ${token}`
                   },
             })

            var received=await res.json()
               
                dispatch(Auth(received))
          } catch (error) {
                console.log(error.message)
            } 
         }
       
    }

 export const AddTasktoBackend=(token,body)=>{
    return async(dispatch, getState, api) => {
        try {
             const res=await fetch(`${API_BASE_URL}/task/addtask`,{
            
             method:"POST",
             body:JSON.stringify(body),
             headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
               },
         })

        var received=await res.json()
             alert(received.status)
           
      } catch (error) {
            console.log(error.message)
        } 
     }
   
 }
   
 export const TaskPageData=(token,id,filter)=>{
    return async(dispatch, getState, api) => {
        try {
             const res=await fetch(`${API_BASE_URL}/task/${id}?filter=${filter}`,{
                headers: {
                   
                    'Authorization': `Bearer ${token}`
                  },
             })
          var received=await res.json()
        
          dispatch(AddTASKData(received.data))
           
      } catch (error) {
            console.log(error.message)
        } 
     }
 }

 export const UpdateTask=(taskid,filter,token,id,data)=>{
    return async(dispatch, getState, api) => {
        try {
             await fetch(`${API_BASE_URL}/task/${taskid}`,{
                method:"PATCH",
                body:JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
             })
         
         
           dispatch(TaskPageData(token,id,filter))
           
      } catch (error) {
            console.log(error.message)
        } 
     }
 }
 export const updateSubtask=(taskid,subid,filter,token,id,data)=>{
    return async(dispatch, getState, api) => {
        try {
             await fetch(`${API_BASE_URL}/task/${taskid}/${subid}`,{
                method:"PATCH",
                body:JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
             })
          
          
           dispatch(TaskPageData(token,id,filter))
           
      } catch (error) {
            console.log(error.message)
        } 
     }
 }

 export const DeleteTask=(taskid,filter,token,id)=>{
    return async(dispatch, getState, api) => {
        try {
             await fetch(`${API_BASE_URL}/task/${taskid}`,{
                method:"DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
             })
          
         
         dispatch(TaskPageData(token,id,filter))
           
      } catch (error) {
           console.log(error.message)
        } 
     }
 }

// AI Actions
const setAISuggestions = (data) => {
    return {
        type: AI_SUGGESTIONS,
        payload: data
    }
}

const setAILoading = (loading) => {
    return {
        type: AI_LOADING,
        payload: loading
    }
}

const setAIError = (error) => {
    return {
        type: AI_ERROR,
        payload: error
    }
}

export const generateAISuggestions = (input) => {
    return async (dispatch, getState, api) => {
        try {
            dispatch(setAILoading(true))
            dispatch(setAIError(null))

            const res = await fetch(`${API_BASE_URL}/ai/generate-suggestions`, {
                method: "POST",
                body: JSON.stringify({ input }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const received = await res.json()
            
            if (received.success) {
                dispatch(setAISuggestions(received.data))
            } else {
                dispatch(setAIError(received.message || 'Failed to generate suggestions'))
            }
        } catch (error) {
            console.log('AI Generation Error:', error)
            dispatch(setAIError('Network error. Please try again.'))
        } finally {
            dispatch(setAILoading(false))
        }
    }
}

export const clearAISuggestions = () => {
    return (dispatch) => {
        dispatch(setAISuggestions(null))
        dispatch(setAIError(null))
    }
}

// Timer Actions
export const startTimer = (taskId) => {
    return async (dispatch, getState, api) => {
        try {
            const res = await fetch(`${API_BASE_URL}/time/start/${taskId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("Token")}`
                }
            })
            const received = await res.json()
            if (received.message === "started") {
                alert("Timer started successfully!")
            } else {
                alert(received.message)
            }
        } catch (error) {
            console.log('Start Timer Error:', error)
            alert('Failed to start timer')
        }
    }
}

export const stopTimer = (taskId) => {
    return async (dispatch, getState, api) => {
        try {
            const res = await fetch(`${API_BASE_URL}/time/stop/${taskId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("Token")}`
                }
            })
            const received = await res.json()
            if (received.message === "stopped") {
                alert("Timer stopped successfully!")
            } else {
                alert(received.message)
            }
        } catch (error) {
            console.log('Stop Timer Error:', error)
            alert('Failed to stop timer')
        }
    }
}

export const getTimeLogs = (taskId) => {
    return async (dispatch, getState, api) => {
        try {
            const res = await fetch(`${API_BASE_URL}/time/task/${taskId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("Token")}`
                }
            })
            const received = await res.json()
            return received
        } catch (error) {
            console.log('Get Time Logs Error:', error)
            return null
        }
    }
}
   
