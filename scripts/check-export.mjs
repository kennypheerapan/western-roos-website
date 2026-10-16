import fs from 'node:fs';
import { chromium } from 'playwright';
// BUILD 15 requires the production Next.js server, not a static export.
const base=(process.env.TEST_BASE_URL || 'http://127.0.0.1:3005');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
  const page=await browser.newPage();
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text()+' '+m.location().url);});
  for(const route of ['/','/competition','/fixtures','/tournaments','/clubs/united','/clubs/west-coast-marlins','/events','/play','/community','/shop','/clubs','/teams','/news','/gallery','/about','/join']) {
    const response=await page.goto(base+route,{waitUntil:'networkidle'});
    if(!response.ok())throw Error(route);
    if(await page.locator('h1').count()!==1)throw Error('Missing heading '+route);
  }
  await page.goto(base+'/fixtures',{waitUntil:'networkidle'});
  await page.getByLabel('Status',{exact:true}).selectOption('cancelled');
  if(!await page.getByRole('heading',{name:'Cancelled fixtures'}).count())throw Error('Export hydration/filter failure');
  for(const route of ['/fixtures/unknown','/fixtures/demo-01','/tournaments/unknown','/events/unknown']) {
    if((await page.request.get(base+route)).status()!==404)throw Error('Expected 404 '+route);
  }
  await page.goto(base+'/events',{waitUntil:'networkidle'});
  await page.getByRole('group',{name:'Event categories'}).getByRole('button',{name:'Poker',exact:true}).click();
  if(!await page.getByRole('status').filter({hasText:'0 confirmed upcoming events · Poker'}).count())throw Error('Event export hydration/filter failure');
  await page.goto(base+'/events#category-charity',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>document.querySelector('#category-charity')?.getAttribute('aria-pressed')==='true');
  await page.getByRole('button',{name:'Club life'}).click();
  await page.getByRole('navigation',{name:'Main navigation'}).getByRole('link',{name:'Poker events',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('#category-poker')?.getAttribute('aria-pressed')==='true');
  if(errors.length)throw Error(errors.join('\n'));
  fs.writeFileSync('test-results/build03-export.json',JSON.stringify({routes:16,unknownRoutes:4,hydration:'passed',filters:'passed',errors},null,2));
  console.log('PASS: production server, hydrated filtering, removed demo URL and unknown detail 404s.');
} finally { await browser.close(); }
