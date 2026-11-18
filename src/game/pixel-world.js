// Original hand-coded pixel artwork. No third-party game assets.
export const W=1080,H=744;
export const places=[
 {x:250,y:269,name:'Technology Centre',short:'SYSTEMS DOJO',color:'#54d6ce',npc:'Aiko'},
 {x:830,y:269,name:'Resource Workshop',short:'CRAFTSMAN QUARTER',color:'#ffd16b',npc:'Kenji'},
 {x:540,y:198,name:'Council Hall',short:'GOVERNANCE SHRINE',color:'#f7a8d4',npc:'Hana'},
 {x:260,y:589,name:'Service Desk',short:'SERVICE TEAHOUSE',color:'#a7d978',npc:'Ren'},
 {x:818,y:584,name:'Security Gate',short:'GUARDIAN KEEP',color:'#a3b5ff',npc:'Sora'}
];
export const scrolls=[
 {x:390,y:335,text:'IT capability combines hardware, software and people. A new device alone may not solve the problem.'},
 {x:688,y:337,text:'Governance connects technology decisions to organisational goals and clear accountability.'},
 {x:539,y:386,text:'Preserve room in the budget for uncertainty. A sensible reserve can protect essential services.'},
 {x:393,y:618,text:'Restore the service, then investigate recurring causes. Incident management and problem management work together.'},
 {x:687,y:620,text:'Security is a shared responsibility. Evidence, clear roles and tested recovery matter.'}
];
export const coast=[[74,128],[124,93],[208,68],[292,77],[377,56],[457,70],[536,49],[626,66],[699,54],[776,80],[864,73],[954,112],[1000,161],[1013,239],[993,304],[1014,376],[995,454],[1016,528],[985,614],[936,674],[856,700],[762,690],[688,714],[592,698],[513,715],[416,695],[325,711],[242,692],[164,700],[101,652],[74,573],[82,494],[59,421],[77,349],[59,272]];
export function inside(x,y){
 let ok=false;for(let i=0,j=coast.length-1;i<coast.length;j=i++){
  const a=coast[i],b=coast[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])ok=!ok;
 }return ok;
}
export function makeArt(scene){
 const canvas=scene.textures.createCanvas('sakura-world',W,H),c=canvas.context;c.imageSmoothingEnabled=false;
 const solids=[];
 let seed=941;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const r=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))};
 const poly=(pts,col)=>{c.fillStyle=col;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill()};
 const line=(pts,col,width=2)=>{c.strokeStyle=col;c.lineWidth=width;c.lineJoin='miter';c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()};
 const ellipse=(x,y,rx,ry,col)=>{c.fillStyle=col;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill()};
 const patch=(x,y,s,col)=>poly([[x-s,y-s*.3],[x-s*.65,y-s*.7],[x-s*.2,y-s*.7],[x-s*.2,y-s],[x+s*.4,y-s],[x+s*.4,y-s*.7],[x+s*.8,y-s*.7],[x+s*.8,y-s*.3],[x+s,y-s*.3],[x+s,y+s*.3],[x+s*.65,y+s*.3],[x+s*.65,y+s*.65],[x-s*.65,y+s*.65],[x-s*.65,y+s*.3],[x-s,y+s*.3]],col);
 // Ocean is tiled with distinct, quiet shades.
 r(0,0,W,H,'#237a9c');
 for(let y=0;y<H;y+=12)for(let x=0;x<W;x+=20){if(rand()>.45)r(x,y,18,2,['#318eaa','#348aa7','#236f94'][Math.floor(rand()*3)])}
 const outer=coast.map(([x,y])=>[540+(x-540)*1.045,380+(y-380)*1.045]);
 poly(outer,'#4ab2c2');line([...outer,outer[0]],'#73d3cc',5);
 poly(coast,'#d6bb7e');line([...coast,coast[0]],'#efdaa4',7);
 const grass=coast.map(([x,y])=>[540+(x-540)*.977,380+(y-380)*.977]);poly(grass,'#6fa85d');line([...grass,grass[0]],'#497b4b',4);
 // Layered grass and low foliage.
 for(let i=0;i<2900;i++){const x=Math.floor(rand()*W/3)*3,y=Math.floor(rand()*H/3)*3;if(inside(x,y)&&!(y>405&&y<463))r(x,y,rand()>.8?6:3,2,['#76b366','#83ba67','#609451','#679f54'][Math.floor(rand()*4)])}
 // Mountain gardens in the north.
 [[146,164,76],[930,160,85],[392,112,43],[707,110,44]].forEach(([x,y,s])=>{
  patch(x,y,s,'#45675c');patch(x-9,y-8,s*.82,'#608775');patch(x-19,y-18,s*.62,'#799c83');
  poly([[x-s*.56,y-s*.58],[x-s*.2,y-s*.92],[x+s*.2,y-s*.67],[x+s*.42,y-s*.36],[x+s*.05,y-s*.42],[x-s*.09,y-s*.6],[x-s*.29,y-s*.46]],'#a7b8a3');
 });
 // Broad sandy footpaths with individual edge stones.
 const paths=[[[250,318],[540,318],[830,318]],[[540,216],[540,653]],[[260,631],[540,631],[818,631]],[[250,318],[250,350]],[[830,318],[830,350]],[[260,631],[260,620]],[[818,631],[818,615]]];
 paths.forEach(pts=>{line(pts,'#638d4e',37);line(pts,'#bcad75',31);line(pts,'#e5cf91',25);line(pts,'#edd9a1',13)});
 for(let i=0;i<160;i++){const x=rand()*780+150,y=i%2?318:631;if(Math.abs(x-540)>30){r(x,y+13,8,3,'#9f9869');r(x+2,y+13,5,1,'#d3c68e');if(rand()>.5)r(x,y-13,5,2,'#b0a879')}}
 for(let y=234;y<690;y+=23){r(520,y,5,3,'#b4a779');r(556,y+6,5,3,'#f3e0ac')}
 // River banks, shallows, stone edges.
 poly([[66,404],[260,404],[350,419],[470,406],[610,410],[740,403],[1006,410],[1006,461],[739,452],[605,461],[468,455],[350,466],[260,451],[69,458]],'#426c55');
 poly([[66,412],[260,412],[350,427],[470,414],[610,418],[740,411],[1006,418],[1006,453],[739,444],[605,453],[468,447],[350,458],[260,443],[69,450]],'#4fbbbf');
 poly([[66,419],[260,419],[350,434],[470,421],[610,425],[740,418],[1006,425],[1006,447],[739,438],[605,447],[468,441],[350,452],[260,437],[69,444]],'#2e95b4');
 for(let i=0;i<85;i++){const x=80+rand()*920,y=417+rand()*29;r(x,y,8+rand()*15,2,rand()>.4?'#72d2d0':'#4caebf')}
 // Bridge with cast shadow, slatted deck and lacquered rails.
 r(480,400,127,75,'#315e5b');r(486,396,112,73,'#916344');
 for(let x=489;x<595;x+=10){r(x,397,8,68,'#bd8b59');r(x,398,8,3,'#e4b471');r(x,455,8,5,'#916244')}
 [483,596].forEach(x=>{r(x,389,6,81,'#6a3e39');for(let y=390;y<475;y+=22){r(x-3,y-7,12,14,'#a34d3c');r(x-4,y-10,14,5,'#d89154')}});
 // Buildings are different silhouettes and have meaningful doorways.
 function roof(x,y,w,h,col='#355b70',light='#4c7d91'){
  poly([[x-8,y+h],[x+4,y+h-7],[x+17,y+6],[x+w/2-15,y],[x+w/2+15,y],[x+w-17,y+6],[x+w-4,y+h-7],[x+w+8,y+h]],'#223c4d');
  poly([[x-6,y+h-5],[x+13,y+h-12],[x+24,y+8],[x+w/2,y+3],[x+w-24,y+8],[x+w-13,y+h-12],[x+w+6,y+h-5]],col);
  for(let k=11;k<h-6;k+=7)line([[x+23-(k/h)*18,y+k],[x+w-23+(k/h)*18,y+k]],light,2);
  for(let xx=x+27;xx<x+w-20;xx+=11)line([[xx,y+8],[x+w/2+(xx-x-w/2)*1.18,y+h-8]],'#27495f',1);
  r(x-8,y+h-2,w+16,4,'#e2af63');r(x+7,y+h+2,w-14,5,'#694c40');r(x+w/2-3,y-8,6,10,'#d3a34d');
 }
 function building(p,i){
  const w=i===2?142:i===4?124:140,x=p.x-w/2,base=p.y;
  ellipse(p.x+8,base+18,w*.65,18,'#527b49');
  r(x-8,base-61,w+16,75,'#745043');r(x,base-71,w,76,'#e5cf9e');r(x+5,base-68,w-10,64,'#f9e7bd');
  r(x+4,base-62,7,67,'#8d5e43');r(x+w-11,base-62,7,67,'#8d5e43');r(x+8,base-13,w-16,5,'#b27d4c');r(x-5,base+5,w+10,9,'#a78158');r(x+4,base+15,w-8,5,'#d4ba83');
  [x+21,x+w-48].forEach(wx=>{r(wx,base-48,27,29,'#6f4739');r(wx+3,base-45,21,23,i===0?'#5bafb2':'#9abfab');r(wx+5,base-43,4,9,'#c5e0c0');r(wx+12,base-44,2,22,'#856346');r(wx+3,base-34,21,2,'#856346')});
  r(p.x-13,base-35,26,40,'#694839');r(p.x-10,base-32,20,37,'#31545c');r(p.x-2,base-30,2,35,'#b38958');r(p.x+5,base-13,3,3,'#f4c775');
  const colors=i===1?['#a55b43','#cc8051']:i===3?['#526945','#7b8a54']:i===4?['#414e70','#66759b']:['#325c70','#508799'];
  roof(x-10,base-117,w+20,50,...colors);
  if(i===2){roof(x+3,base-158,w-6,40,'#9d493f','#c7684c');roof(x+24,base-189,w-48,32,'#a45043','#d17c52');r(p.x-2,base-207,4,22,'#e7bd63');r(p.x-5,base-210,10,4,'#f3d98d')}
  if(i===4){r(x+12,base-145,18,28,'#dbbd84');r(x+w-30,base-145,18,28,'#dbbd84');roof(x+5,base-164,34,22,'#414e70','#66759b');roof(x+w-39,base-164,34,22,'#414e70','#66759b')}
  // Exterior signs, shop curtains, racks and technology details.
  r(p.x-32,base-65,64,15,'#74503a');r(p.x-29,base-63,58,10,'#f4d99a');
  for(let j=0;j<5;j++){r(p.x-21+j*10,base-60,5,2,'#81624c');r(p.x-19+j*10,base-61,2,7,'#81624c')}
  if(i===0){r(x-28,base-24,18,31,'#334f63');for(let j=0;j<3;j++){r(x-25,base-21+j*8,12,5,'#50849a');r(x-23,base-19+j*8,3,2,'#8befca')}}
  if(i===1){[[x-25,base-7],[x+w+8,base-4]].forEach(([cx,cy])=>{r(cx,cy-17,20,20,'#9a6a42');r(cx+2,cy-15,16,16,'#c38f51');line([[cx+2,cy-15],[cx+18,cy+1]],'#e3b36d',2);line([[cx+18,cy-15],[cx+2,cy+1]],'#e3b36d',2)})}
  if(i===3){r(x-12,base-54,w+24,12,'#b24b49');for(let k=0;k<8;k++)r(x-10+k*20,base-52,10,8,'#f0b885');r(x+w+12,base-8,26,6,'#815940');r(x+w+15,base-2,4,12,'#634731');r(x+w+32,base-2,4,12,'#634731')}
  // Stone lanterns at the entrances.
  [x-18,x+w+12].forEach(lx=>{r(lx,base+2,7,12,'#879486');r(lx-3,base-6,13,9,'#ccd2b2');r(lx,base-4,7,6,'#f8d685');poly([[lx-6,base-6],[lx+3,base-14],[lx+12,base-6]],'#5a6e67');r(lx-4,base+13,15,4,'#9ca98e')});
  solids.push({x:x-5,y:base-76,w:w+10,h:base===198?87:88});
 }
 places.forEach(building);
 // Torii gate at the southern entrance.
 function torii(x,y,s=1){const q=(a,b,w,h,col)=>r(x+a*s,y+b*s,w*s,h*s,col);q(-46,-72,10,72,'#ad483c');q(36,-72,10,72,'#ad483c');q(-49,-3,16,6,'#443c3d');q(33,-3,16,6,'#443c3d');q(-57,-78,114,10,'#e96543');q(-62,-84,124,7,'#344b51');q(-48,-56,96,8,'#ce593d');q(-7,-70,14,30,'#8b4c35');q(-4,-67,8,23,'#edbd66')}
 torii(540,694,.8);torii(540,243,.48);
 // Small fences around garden and terrace areas.
 function fence(x,y,n){for(let i=0;i<n;i++){r(x+i*13,y-12,5,19,'#b7a16d');r(x+i*13,y-13,5,3,'#e5cf92')}r(x-2,y-5,n*13,3,'#b19a65')}
 fence(147,352,8);fence(824,352,8);fence(161,647,6);fence(843,649,5);
 // Bamboo stands, stone gardens and hedges.
 for(const [x,y] of [[99,338],[960,326],[423,168],[669,172],[117,571],[947,575]]){
  for(let k=0;k<6;k++){const bx=x+k*5,by=y-(k%3)*9;r(bx,by-45,3,52,'#427b4b');for(let j=0;j<4;j++)r(bx,by-39+j*12,3,2,'#9cba70');line([[bx,by-32],[bx-10,by-39]],'#5d9354',3);line([[bx,by-20],[bx+9,by-28]],'#5d9354',3)}
 }
 for(const [x,y] of [[376,245],[704,236],[367,558],[692,555]]){
  ellipse(x,y+11,23,7,'#547d46');patch(x,y,18,'#728477');patch(x-4,y-5,12,'#aab4a0');r(x-9,y-8,9,3,'#cfceb4');r(x+5,y+1,8,4,'#5d7165');
  for(let j=0;j<8;j++)r(x-25+j*7,y+18+(j%2)*4,4,2,'#c5bd8f')
 }
 // Paper lantern strings along the river.
 function lantern(x,y,col='#ee8c64'){r(x,y-2,2,5,'#665742');r(x-6,y+3,14,16,col);r(x-7,y+7,16,8,'#ffd18a');r(x-4,y+4,2,14,'#f4ad73');r(x+6,y+4,2,14,'#d76f51');r(x-3,y+20,8,3,'#6c5040')}
 for(const y of [380,489]){line([[111,y],[969,y]],'#596344',2);for(let x=136;x<970;x+=55)if(x<480||x>610)lantern(x,y-4)}
 // Trees are layered canopies; their crowns get natural pixel highlights.
 const trees=[[130,225,42,0],[91,176,37,1],[171,163,40,0],[348,150,41,1],[738,140,42,0],[942,218,44,1],[1005,261,34,0],[111,500,39,1],[149,539,38,0],[366,483,43,0],[727,485,40,1],[951,519,45,0],[975,622,38,1],[130,641,33,0],[367,686,37,1],[721,688,42,0],[924,663,36,0],[432,103,29,1],[664,105,30,0]];
 trees.forEach(([x,y,s,green])=>{
  ellipse(x+8,y+30,s*.82,s*.32,'#537e48');r(x-5,y-10,11,44,'#6a4d3d');r(x-3,y-9,4,40,'#95704a');line([[x,y+8],[x-14,y-7]],'#71543f',5);line([[x+2,y+2],[x+18,y-13]],'#71543f',5);
  const colors=green?['#357d56','#49985b','#65ad66','#9ac26f']:['#aa5680','#cf719d','#e995b6','#ffc3cc'];
  patch(x+5,y-20,s,colors[0]);patch(x-8,y-28,s*.89,colors[1]);patch(x+4,y-36,s*.77,colors[2]);patch(x-13,y-41,s*.54,colors[3]);
  for(let j=0;j<35;j++){const px=x-s*.75+rand()*s*1.4,py=y-s*.9+rand()*s*.85;r(px,py,rand()>.6?5:3,3,colors[Math.floor(rand()*3)+1])}
  solids.push({x:x-8,y:y+8,w:17,h:24});
 });
 // Flowers, lily pads, mushrooms and fallen petals.
 for(let i=0;i<160;i++){const x=100+rand()*880,y=100+rand()*570;if(!inside(x,y)||y>390&&y<479||Math.abs(x-540)<34||Math.abs(y-318)<24||Math.abs(y-631)<24||places.some(p=>Math.abs(x-p.x)<100&&y>p.y-140&&y<p.y+35))continue;
  r(x,y+3,2,5,'#427349');const color=['#f3d785','#edabc4','#e8e7b2'][i%3];r(x-2,y,6,4,color);r(x,y-2,2,8,color);r(x,y+1,2,2,'#d0874d')
 }
 for(let x=135;x<980;x+=140){ellipse(x,440,9,4,'#4b936b');r(x-1,437,3,3,'#df9bba')}
 // Small market stalls near the entrance and stacks of books.
 [[424,561],[654,559]].forEach(([x,y],i)=>{r(x-23,y-25,5,37,'#785340');r(x+22,y-25,5,37,'#785340');r(x-29,y,62,10,'#a6764a');r(x-27,y-38,58,13,i?'#cf7653':'#dfb360');for(let j=0;j<5;j++)r(x-26+j*12,y-36,6,11,i?'#f8c67f':'#f6dfa3');r(x-22,y+9,4,14,'#785340');r(x+22,y+9,4,14,'#785340');for(let j=0;j<4;j++)r(x-17+j*10,y-7,8,6,['#b75f56','#789d72','#688fa6','#e2bc72'][j])});
 // Wayfinding signs.
 [[458,333],[618,622]].forEach(([x,y])=>{r(x,y,4,25,'#795e40');r(x-20,y-10,44,16,'#855a3e');r(x-18,y-8,40,11,'#d9b477');r(x-11,y-4,22,2,'#9b7349')});
 canvas.refresh();
 return {solids};
}
export function makeSprites(scene){
 const palette={'.':null,o:'#273744',b:'#8d624c',B:'#c58b57',s:'#f7d5ab',w:'#fff3d6',e:'#fffdf0',p:'#ea8e82',t:'#268a8c',T:'#51b9ac',d:'#235866',y:'#f6c668',r:'#d44f50',g:'#78a66a',u:'#7d81ad'};
 const rows=[
 '.......bb....bb.........',
 '......bBBb..bBBb........',
 '.....bBBBBbbBBBBb.......',
 '.....bBwwBBBBwwBb.......',
 '....bBwwwwBBwwwwBb......',
 '....bBwoewBBweowBb......',
 '....bBwoswBBwsowBb......',
 '.....bBwwBooBwwBb.......',
 '......bBBswwsBBb........',
 '.......rryrrr...........',
 '......drryrrrd..........',
 '.....dTTTyyTTTd.........',
 '....dTTTTyyTTTTd........',
 '....dTTTTyyTTTTd........',
 '....dTsTTyyTTsTd........',
 '.....ssTTyyTTss.........',
 '.......dTTTTd...........',
 '.......do..od...........',
 '......ooo..ooo..........',
 '........................'
 ];
 const draw=(name,colors,frame=0)=>{
  const tex=scene.textures.createCanvas(name,24,24),c=tex.context;
  rows.forEach((row,y)=>[...row].forEach((ch,x)=>{const col=colors[ch]||palette[ch];if(col){c.fillStyle=col;c.fillRect(x,y+(y>15&&frame===1?(x<11?1:-1):0),1,1)}}));tex.refresh();
 };
 draw('explorer',{});draw('explorer-step',{},1);
 [['aiko','#428da4','#76c8c9'],['kenji','#b47e39','#e3b76a'],['hana','#9c6291','#d79fbc'],['ren','#5d8f54','#9cbd73'],['sora','#5c679e','#9baddc']].forEach(([n,d,l])=>draw(n,{t:d,T:l,r:'#7c5e60'}));
 const tex=scene.textures.createCanvas('knowledge-scroll',16,19),c=tex.context;
 [['#8f573c',1,2,14,15],['#f1cd77',3,3,10,13],['#fff0b7',4,4,8,11],['#b88c4b',5,6,6,1],['#b88c4b',5,9,5,1],['#b88c4b',5,12,6,1],['#e3ae56',0,0,16,3],['#e3ae56',0,16,16,3]].forEach(([col,x,y,w,h])=>{c.fillStyle=col;c.fillRect(x,y,w,h)});tex.refresh();
}
export function walkable(x,y,solids){
 if(!inside(x,y)||x<90||x>990||y<110||y>695)return false;
 if(y>402&&y<468&&(x<497||x>586))return false;
 return !solids.some(b=>x>b.x-8&&x<b.x+b.w+8&&y>b.y-4&&y<b.y+b.h+4);
}
export function findPath(sx,sy,tx,ty,solids){
 const size=12,cols=90,rows=62,toCell=(x,y)=>[Math.floor(x/size),Math.floor(y/size)],start=toCell(sx,sy),target=toCell(tx,ty);
 const key=([x,y])=>y*cols+x,open=[start],came=new Map([[key(start),null]]);
 while(open.length){const a=open.shift();if(key(a)===key(target)){const path=[];let n=a;while(n){path.unshift({x:n[0]*size+size/2,y:n[1]*size+size/2});n=came.get(key(n))}return path.slice(1)}
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){const n=[a[0]+dx,a[1]+dy],k=key(n);if(n[0]<0||n[0]>=cols||n[1]<0||n[1]>=rows||came.has(k)||!walkable(n[0]*size+6,n[1]*size+6,solids))continue;came.set(k,a);open.push(n)}
 }return [];
}
