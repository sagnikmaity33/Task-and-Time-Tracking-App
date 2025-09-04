import {ADD_USER,AUTH,ADD_TASK,RTASK,AI_SUGGESTIONS,AI_LOADING,AI_ERROR} from "./action"

export const reducer=(store={user:{},tasks:undefined,home_pageData:{},ai:{suggestions:null,loading:false,error:null}},{type,payload})=>{
             switch(type){
               
                 case ADD_USER:
                     return {...store,user:payload}
                 case AUTH:
                    return {...store,home_pageData:payload}
                 case ADD_TASK:
                    return {...store,tasks:payload}
                 case RTASK:
                    return {...store,tasks:payload}
                 case AI_SUGGESTIONS:
                    return {...store,ai:{...store.ai,suggestions:payload,error:null}}
                 case AI_LOADING:
                    return {...store,ai:{...store.ai,loading:payload}}
                 case AI_ERROR:
                    return {...store,ai:{...store.ai,error:payload,suggestions:null}}
                 default:
                     return store
             }
}