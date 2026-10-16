// Local review only. Never pushes, deploys, applies SQL or enables writes.
import {spawn} from 'node:child_process';
import { presidentEnvironment } from './president-environment.mjs';
const env=presidentEnvironment();
let child;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{child?.kill();process.exit(0);});
async function run(args){child=spawn(process.execPath,['node_modules/next/dist/bin/next',...args],{env,stdio:'inherit',windowsHide:true});return new Promise(resolve=>{child.on('error',()=>resolve(1));child.on('exit',resolve);});}
const verification=process.argv.includes('--verify');
if(!verification){const code=await run(['build']);if(code!==0)process.exit(code??1);}
console.log('President preview: backend disconnected, admin unavailable, all writes blocked; .env.local unchanged.');
process.exitCode=await run(['start','--hostname','127.0.0.1','--port',verification?'3041':'3021'])??1;
