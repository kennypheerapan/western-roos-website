import { chromium } from 'playwright';
import fs from 'node:fs';
const browser = await chromium.launch({headless:true,channel:'msedge'});
const page = await browser.newPage({reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const report=[];
const routes=['/','/clubs','/clubs/united','/clubs/west-coast-marlins'];
for(const width of [375,430,768,1366,1920,2560]){
  await page.setViewportSize({width,height:900});
  for(const route of routes){
    const res=await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+route,{waitUntil:'networkidle'});
    if(!res.ok())throw Error(route+' HTTP '+res.status());
    await page.evaluate(()=>document.fonts.ready);
    for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(image=>image.decode());}
    await page.waitForLoadState('networkidle');
    const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),headings:document.querySelectorAll('h1').length}));
    if(state.overflow||state.broken.length||state.headings!==1)throw Error(JSON.stringify({route,width,...state}));
    await page.screenshot({path:`test-results/build02-${route.replaceAll('/','_')||'home'}-${width}.png`,fullPage:true});
    report.push({route,width,...state});
  }
}
await page.setViewportSize({width:375,height:812});
await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005'));
await page.getByRole('button',{name:'Menu'}).click();
await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Pathways',exact:true}).click();
await page.waitForURL('**/clubs');
await page.getByRole('navigation',{name:'Club family'}).getByRole('link',{name:'United',exact:true}).click();
await page.waitForURL('**/clubs/united');
await page.getByRole('navigation',{name:'Club family'}).getByRole('link',{name:'Marlins Masters',exact:true}).click();
await page.waitForURL('**/clubs/west-coast-marlins');
if(await page.locator('img[src*="united"]').count())throw Error('United media on Marlins');
for(const route of routes){
  await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+route);
  const links=await page.locator('a[href^="/"]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href').split('#')[0]))]);
  for(const link of links){const r=await page.request.get((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+link);if(!r.ok())throw Error('Broken link '+link);}
  await page.addStyleTag({content:'html{font-size:200%}'});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Text zoom overflow '+route);
}
fs.writeFileSync('test-results/build02-report.json',JSON.stringify({report,errors,navigation:'passed',links:'passed',textZoom:'passed'},null,2));
await browser.close();
if(errors.length)throw Error(errors.join('\n'));
console.log('PASS: 24 route/viewport checks, images, console, navigation, links, text zoom.');
