/* global console, document, window */
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {missions,evaluate,statsFor,initialState,validSave} from '../src/game/content.js';
const b=await chromium.launch({headless:true,args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1440,height:1100}});
const errors=[];p.on('pageerror',e=>errors.push(e.message));
const report=[];const note=s=>{report.push(s);console.log('PASS',s)};
try{
 await p.goto('http://localhost:5173',{waitUntil:'networkidle'});
 await p.getByRole('button',{name:'Begin your adventure',exact:true}).click();
 for(const idx of [1,0,2])await p.locator('.assessment .choices button').nth(idx).click();
 await p.getByRole('button',{name:'Enter the village',exact:true}).click();
 await p.locator('canvas').waitFor();note('Home, assessment and pixel map render without runtime errors');
 await p.locator('.matching select').nth(0).selectOption('0');
 await p.locator('.matching select').nth(1).selectOption('1');
 await p.locator('.matching select').nth(2).selectOption('2');
 await p.waitForTimeout(600);await p.reload({waitUntil:'networkidle'});
 await p.getByRole('button',{name:'Continue adventure',exact:true}).click();
 assert.equal(await p.locator('.matching select').nth(2).inputValue(),'2');note('Reload restores mission and draft role assignments');
 await p.getByRole('button',{name:'Visit Security Gate',exact:true}).click();
 assert.match(await p.locator('.notice').innerText(),/earlier missions/);note('Later missions remain locked');
 for(let mi=0;mi<missions.length;mi++){
  const m=missions[mi];
  for(let si=0;si<m.steps.length;si++){
   const st=m.steps[si];
   await p.locator('.mission-card h2').filter({hasText:m.title}).waitFor();
   if(st.type==='choice'){
    if(mi===0&&si===1){
     await p.locator('.choices button').nth(0).click();await p.getByRole('button',{name:'Check my decision'}).click();
     assert.match(await p.locator('.feedback').innerText(),/Reconsider/);
     await p.getByRole('button',{name:'Try an alternative'}).click();note('Weak choices receive feedback and can be retried');
    }
    await p.locator('.choices button').nth(st.correct).click();
   }
   if(st.type==='budget'){
    for(let i=0;i<4;i++){const slider=p.locator('input[type="range"]').nth(i);await slider.focus();await slider.press('Home');for(let j=0;j<st.minimums[i]/5;j++)await slider.press('ArrowRight')}
    assert.match(await p.locator('.budget-total').innerText(),/Allocated: 85\/100/);note('Budget task updates allocation and reserve');
   }
   if(st.type==='order'){
    const current=st.items.map((_,i)=>i);
    for(let target=0;target<st.correct.length;target++){
     let pos=current.indexOf(st.correct[target]);
     while(pos>target){await p.getByRole('button',{name:'Move '+st.items[current[pos]]+' up',exact:true}).click();[current[pos-1],current[pos]]=[current[pos],current[pos-1]];pos--}
    }
   }
   await p.getByRole('button',{name:'Check my decision',exact:true}).click();
   assert.match(await p.locator('.feedback').innerText(),/defensible decision/);
   if(si<2)await p.getByRole('button',{name:'Next decision',exact:true}).click();
  }
  await p.getByLabel('Pause. Connect it to your practice.').fill('I would inspect the evidence, consider service impact and explain the trade-off to the relevant team before acting.');
  if(mi<4)await p.getByRole('button',{name:'Complete mission & continue',exact:true}).click();
  else await p.getByRole('button',{name:'Finish missions & take final check',exact:true}).click();
  note('Mission '+(mi+1)+' completes with decisions and reflection');
 }
 for(const idx of [1,0,2])await p.locator('.assessment .choices button').nth(idx).click();
 await p.getByRole('button',{name:'View learning summary',exact:true}).click();
 await p.getByText('CHAPTER 05 COMPLETE',{exact:true}).waitFor();note('Transfer assessment and chapter completion work');
 await p.getByRole('button',{name:'Open learning journal',exact:true}).click();
 assert.equal(await p.locator('.journal-entry').count(),5);
 assert.match(await p.locator('.journal-summary').innerText(),/15\/15/);
 const downloadPromise=p.waitForEvent('download');await p.getByRole('button',{name:'Export journal',exact:true}).click();const dl=await downloadPromise;assert.match(dl.suggestedFilename(),/Chapter5/);note('Journal records all decisions and exports a backup');
 await p.getByRole('button',{name:'Save settings',exact:true}).click();
 await p.getByRole('checkbox',{name:'Reduce motion'}).check();await p.getByRole('button',{name:'Close dialog'}).click();
 await p.getByRole('button',{name:'The village',exact:true}).click();
 await p.setViewportSize({width:390,height:844});await p.waitForTimeout(700);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);
 await p.screenshot({path:'/tmp/sakura-mobile.png',fullPage:true});note('Mobile homepage has no horizontal overflow');
 await p.getByRole('button',{name:'Continue adventure',exact:true}).click();await p.waitForTimeout(400);
 assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),true);note('Mobile completion layout has no horizontal overflow');
 assert.equal(errors.length,0,'Browser runtime errors: '+errors.join('; '));note('No browser runtime errors throughout full playthrough');
 assert.equal(validSave(initialState()),true);assert.equal(evaluate(missions[1].steps[0],[25,20,20,20]),true);assert.equal(evaluate(missions[1].steps[0],[40,20,20,20]),false);
 const x=statsFor({'0-0':{correct:true,attempts:1}});assert.equal(x.xp,100);assert.equal(x.availability,61);note('Budget boundaries and fixed simulation consequences checked');
 console.log('TOTAL',report.length,'checks passed');
}finally{await b.close()}
