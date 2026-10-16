import { chromium } from 'playwright';
import fs from 'node:fs';
const browser = await chromium.launch({headless:true,channel:'msedge'});
const page = await browser.newPage({reducedMotion:'reduce'});
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const report=[];
for(const width of [375,768,1366]) {
  await page.setViewportSize({width,height:900});
  for(const route of ['/fixtures','/tournaments','/','/clubs/united','/clubs/west-coast-marlins']) {
    const response=await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+route,{waitUntil:'networkidle'});
    if(!response.ok())throw Error(`${route} ${response.status()}`);
    if(await page.locator('h1').count()!==1)throw Error('Heading structure '+route);
    const text=await page.locator('body').innerText();
    if(/demo|Opponent [ABC]|preview data|17–18 October 2026/i.test(text))throw Error('Placeholder competition '+route);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+route);
    await page.screenshot({path:`test-results/build03-${route.replaceAll('/','_')}-${width}.png`,fullPage:true});
    report.push({route,width,status:response.status(),overflow:false});
  }
}
await page.goto(((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+"/fixtures"));
await page.getByLabel('Pathway / Team',{exact:true}).selectOption('club:united');
await page.getByLabel('Status',{exact:true}).selectOption('final');
if(!await page.getByRole('status').filter({hasText:'0 matching matches'}).count())throw Error('Filter status');
await page.getByRole('button',{name:'Reset filters'}).click();
if(await page.getByLabel('Status',{exact:true}).inputValue()!=='')throw Error('Filter reset');
await page.getByLabel('Tournament',{exact:true}).focus();
await page.keyboard.press('Tab');
if(!await page.getByLabel('Division',{exact:true}).evaluate(e=>e===document.activeElement))throw Error('Keyboard filters');
await page.setViewportSize({width:375,height:812});
for(const route of ['/fixtures','/tournaments']) {
  await page.goto((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+route);
  await page.addStyleTag({content:'html{font-size:200%}'});
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Text zoom '+route);
}
const html=fs.readFileSync('test-results/competition-populated.html','utf8');
for(const width of [375,768,1366]) {
  await page.setViewportSize({width,height:900});
  await page.goto(((process.env.TEST_BASE_URL || 'http://127.0.0.1:3005')+"/fixtures"));
  await page.locator('main').evaluate((el,html)=>{el.innerHTML=html;},html);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Populated overflow '+width);
  await page.screenshot({path:`test-results/build03-populated-${width}.png`,fullPage:true});
}
fs.writeFileSync('test-results/build03-report.json',JSON.stringify({report,errors,filters:'passed',keyboard:'passed',populatedLayout:'passed'},null,2));
await browser.close();
if(errors.length)throw Error(errors.join('\n'));
console.log('PASS: Build 03 responsive layouts, empty states, filter interaction, keyboard navigation, text zoom, populated card layouts and clean hydration.');

