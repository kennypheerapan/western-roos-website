'use client';
import {useEffect,useState} from 'react';
export function useBackend() {
 const [backend,setBackend]=useState({available:false,message:'Checking backend availability…'});
 useEffect(()=>{let active=true;fetch('/api/backend',{cache:'no-store'}).then(r=>r.json()).then(data=>{if(active)setBackend(data);}).catch(()=>{if(active)setBackend({available:false,message:'Backend unavailable. Preview only; nothing is saved.'});});return()=>{active=false;};},[]);
 return backend;
}
export class SubmissionError extends Error {
 constructor(message:string,public code='backend_unavailable',public status=0){super(message);}
 get definitive(){return this.status===400||this.status===409;}
}
export async function postSubmission(path:string,payload:unknown) {
 let response:Response;
 let result;
 try {
  response=await fetch(path,{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  result=await response.json();
 } catch { throw new SubmissionError('The submission could not be confirmed. Please retry without changing the details.'); }
 if(!response.ok) throw new SubmissionError(result.message || 'The submission could not be confirmed. Please retry.',result.code,response.status);
 return result;
}
