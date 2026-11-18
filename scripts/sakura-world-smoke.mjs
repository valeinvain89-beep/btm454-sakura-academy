/* global console,localStorage,document,window */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {walkable,findPath} from '../src/game/pixel-world.js';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const p=await browser.newPage({viewport:{width:1440,height:1100}});
const errors=[];p.on('pageerror',e=>errors.push(e.stack||e.message));
const wait=ms=>p.waitForTimeout(ms);
const saved=()=>p.evaluate(()=>JSON.parse(localStorage.getItem('sakura-academy-v1-guest')));
const notes=[];const pass=t=>{notes.push(t);console.log('PASS',t)};
try{
 await p.goto('http://localhost:5173',{waitUntil:'networkidle'});
 await p.getByRole('button',{name:'Begin your adventure',exact:true}).click();
 for(const i of [1,0,2])await p.locator('.assessment .choices button').nth(i).click();
 await p.getByRole('button',{name:'Enter the village',exact:true}).click();
 await p.locator('canvas').waitFor();await wait(500);
 await p.locator('canvas').focus();await p.keyboard.down('ArrowLeft');await wait(1100);await p.keyboard.up('ArrowLeft');await wait(1400);
 let s=await saved();assert.ok(s.world.x<440,'Keyboard moves the character');assert.ok(s.world.scrolls.includes(3),'Nearby scroll collected');pass('Keyboard movement collects knowledge scrolls');
 await p.reload({waitUntil:'networkidle'});await p.getByRole('button',{name:'Continue adventure',exact:true}).click();await p.locator('canvas').waitFor();await wait(500);
 assert.ok((await saved()).world.scrolls.includes(3));assert.match(await p.locator('.world-hud').innerText(),/1\/5 scrolls/);pass('Character position and collected scrolls survive reload');
 await p.getByRole('button',{name:'Show island overview',exact:true}).click();await wait(150);
 const box=await p.locator('canvas').boundingBox();await p.mouse.click(box.x+box.width*250/1080,box.y+box.height*235/744);
 await p.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('sakura-academy-v1-guest'));return s.world.x>230&&s.world.x<270&&s.world.y>300&&s.world.y<335},undefined,{timeout:15000});pass('Click-to-walk path reaches the mentor across the river bridge');
 await p.evaluate(()=>window.scrollTo(0,0));await p.getByRole('button',{name:'Expand game view',exact:true}).click();assert.equal(await p.locator('.world-maximized').count(),1);await p.keyboard.press('Escape');assert.equal(await p.locator('.world-maximized').count(),0);pass('Expanded game view opens and exits with Escape');
 await p.getByRole('button',{name:'Enable music',exact:true}).click();await wait(400);await p.getByRole('button',{name:'Mute music',exact:true}).click();pass('Optional synthesised music starts and mutes');
 await p.setViewportSize({width:390,height:844});await p.evaluate(()=>window.scrollTo(0,0));await wait(1200);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 const old=(await saved()).world.x;const button=await p.getByRole('button',{name:'Walk right',exact:true}).boundingBox();await p.mouse.move(button.x+button.width/2,button.y+button.height/2);await p.mouse.down();await wait(450);await p.mouse.up();await wait(1300);
 assert.ok((await saved()).world.x>old+15,'Touch pad moves the character');pass('Phone layout and on-screen movement controls work');
 await p.screenshot({path:'/tmp/sakura-v2-mobile-game.png',fullPage:false});
 assert.equal(walkable(400,430,[]),false);assert.equal(walkable(540,430,[]),true);assert.ok(findPath(393,618,250,312,[]).length>0);pass('Water blocks movement while the bridge remains navigable');
 assert.equal(errors.length,0,errors.join('; '));pass('No browser runtime errors in the redesigned world');
 console.log('TOTAL',notes.length,'world checks passed');
}finally{await browser.close()}
