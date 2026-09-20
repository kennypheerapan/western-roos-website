import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
const root=path.resolve('out');
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  // Next's Windows export writes segment payloads into nested directories;
  // browsers request their dotted URL form. Map only that payload convention.
  const segmentFile=file.replace(/(__next\.)(.+)(\.txt)$/, (_,prefix,segments,extension)=>prefix+segments.split('.').join(path.sep)+extension);
  const candidate=[file,file+'.html',segmentFile].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
  if(!candidate){res.writeHead(404,{'Content-Type':'text/html'}).end(fs.readFileSync(path.join(root,'404.html')));return;}
  res.writeHead(200,{'Content-Type':mime[path.extname(candidate)]??'application/octet-stream'});
  fs.createReadStream(candidate).pipe(res);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
  for(const route of ['/','/fixtures','/tournaments','/clubs/united','/clubs/west-coast-marlins']) {
    const response=await page.goto(base+route,{waitUntil:'networkidle'});
    if(!response.ok())throw Error(route);
    if(await page.locator('h1').count()!==1)throw Error('Missing heading '+route);
  }
  await page.goto(base+'/fixtures',{waitUntil:'networkidle'});
  await page.getByLabel('Status',{exact:true}).selectOption('cancelled');
  if(!await page.getByRole('heading',{name:'Cancelled fixtures'}).count())throw Error('Export hydration/filter failure');
  for(const route of ['/fixtures/unknown','/fixtures/demo-01','/tournaments/unknown']) {
    if((await page.request.get(base+route)).status()!==404)throw Error('Expected 404 '+route);
  }
  if(errors.length)throw Error(errors.join('\n'));
  fs.writeFileSync('test-results/build03-export.json',JSON.stringify({routes:5,unknownRoutes:3,hydration:'passed',filters:'passed',errors},null,2));
  console.log('PASS: production export, hydrated filtering, removed demo URL and unknown detail 404s.');
} finally { await browser.close();server.close(); }

