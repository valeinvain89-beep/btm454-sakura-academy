import {useEffect,useRef,useState} from 'react';
import {Maximize2,Minimize2,Volume2,VolumeX,Map,Compass,BookOpen,ArrowUp,ArrowDown,ArrowLeft,ArrowRight} from 'lucide-react';
import {W,H,places,scrolls,makeArt,makeSprites,walkable,findPath} from './pixel-world';
export default function Village({onVisit,active,done,compact=false,reduced=false,worldState,onWorldChange}){
 const host=useRef(null),live=useRef({onVisit,active,done,worldState,onWorldChange}),controls=useRef({x:0,y:0,interact:false,overview:false,recenter:false});
 const [error,setError]=useState(false),[loaded,setLoaded]=useState(false),[maximized,setMaximized]=useState(false),[near,setNear]=useState(-1),[tip,setTip]=useState('Follow the lanterns. Aiko is waiting at the Systems Dojo.'),[collected,setCollected]=useState(worldState?.scrolls?.length||0),[music,setMusic]=useState(false),[overview,setOverview]=useState(compact);
 const audio=useRef(null),timer=useRef(null);const [narrow,setNarrow]=useState(false);
 useEffect(()=>{const media=window.matchMedia('(max-width:700px)');const change=()=>setNarrow(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change)},[]);
 useEffect(()=>{const t=setTimeout(()=>window.dispatchEvent(new Event('resize')),80);return()=>clearTimeout(t)},[maximized]);
 useEffect(()=>{live.current={onVisit,active,done,worldState,onWorldChange}},[onVisit,active,done,worldState,onWorldChange]);
 useEffect(()=>{if(!maximized)return;const prev=document.body.style.overflow;document.body.style.overflow='hidden';const close=e=>{if(e.key==='Escape')setMaximized(false)};document.addEventListener('keydown',close);return()=>{document.body.style.overflow=prev;document.removeEventListener('keydown',close)}},[maximized]);
 useEffect(()=>()=>{clearInterval(timer.current);audio.current?.close()},[]);
 const toggleMusic=()=>{
  if(music){clearInterval(timer.current);audio.current?.suspend();setMusic(false);return}
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC){setTip('Sound is unavailable in this browser.');return}
  const ctx=audio.current||(audio.current=new AC());ctx.resume();let beat=0;
  const notes=[261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,392,440,523.25,659.25,523.25,392,329.63];
  const play=()=>{const now=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=notes[beat++%notes.length];g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(.022,now+.03);g.gain.exponentialRampToValueAtTime(.001,now+.43);o.connect(g);g.connect(ctx.destination);o.start(now);o.stop(now+.46)};
  play();timer.current=setInterval(play,440);setMusic(true)
 };
 useEffect(()=>{
  let game,stopped=false,detachInputs=()=>{};
  setLoaded(false);
  import('phaser').then(({default:P})=>{
   if(stopped)return;
   class Island extends P.Scene{
    create(){
     const {solids}=makeArt(this);this.solids=solids;makeSprites(this);this.add.image(0,0,'sakura-world').setOrigin(0).setDepth(0);
     this.cameras.main.setBackgroundColor('#237a9c');this.cameras.main.setBounds(0,0,W,H);
     this.collected=new Set((live.current.worldState?.scrolls||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<5));setCollected(this.collected.size);
     this.banners=[];this.markers=[];this.npcs=[];
     places.forEach((p,i)=>{
      const npc=this.add.sprite(p.x+44,p.y+39,['aiko','kenji','hana','ren','sora'][i]).setScale(1.6).setDepth(15);
      const shadow=this.add.ellipse(p.x+44,p.y+55,27,9,0x234849,.32).setDepth(10);
      if(!reduced)this.tweens.add({targets:npc,y:p.y+37,duration:950+i*170,yoyo:true,repeat:-1});
      const text=this.add.text(p.x,p.y-125-(i===2?93:i===4?47:0),p.short,{fontFamily:'monospace',fontSize:'11px',fontStyle:'bold',color:'#fff4d6',backgroundColor:'#253e4be8',padding:{x:10,y:6}}).setOrigin(.5).setDepth(35);
      this.banners.push(text);
      const marker=this.add.text(p.x+44,p.y-9,'!',{fontFamily:'monospace',fontSize:'24px',fontStyle:'bold',color:'#ffda79',stroke:'#6e4439',strokeThickness:4}).setOrigin(.5).setDepth(35);this.markers.push(marker);
      if(!reduced)this.tweens.add({targets:marker,y:marker.y-5,duration:650,yoyo:true,repeat:-1,delay:i*100});
      const z=this.add.zone(p.x,p.y-16,174,148).setDepth(20).setInteractive({useHandCursor:true});
      z.on('pointerover',()=>{text.setColor(p.color);setTip(p.npc+' · '+p.name+'. Click to walk here and begin the challenge.')});
      z.on('pointerout',()=>text.setColor('#fff4d6'));
      z.on('pointerdown',pointer=>{pointer.event?.stopPropagation();this.goTo(p.x,p.y+43,i)});
      this.npcs.push({sprite:npc,shadow});
     });
     this.scrollSprites=scrolls.map((s,i)=>{
      if(this.collected.has(i))return null;
      const glow=this.add.ellipse(s.x,s.y+8,27,12,0xffd26b,.25).setDepth(9);
      const sprite=this.add.image(s.x,s.y,'knowledge-scroll').setScale(1.2).setDepth(13);
      if(!reduced)this.tweens.add({targets:sprite,y:s.y-5,duration:800,yoyo:true,repeat:-1,delay:i*100});
      return {sprite,glow}
     });
     // Living water, koi and floating petals use independent animation layers.
     if(!reduced){
      for(let i=0;i<23;i++){
       const wave=this.add.rectangle(80+i*41,428+(i%3)*7,14+(i%4)*4,2,0xb4f0da,.55).setDepth(2);
       this.tweens.add({targets:wave,x:wave.x+38,alpha:.1,duration:2100+i*80,yoyo:true,repeat:-1,delay:i*130});
      }
      for(let i=0;i<7;i++){
       const fish=this.add.container(143+i*120,431+(i%2)*9).setDepth(3);fish.add([this.add.ellipse(0,0,11,4,i%2?0xf2c987:0xeea394,.85),this.add.triangle(-7,0,0,-3,0,3,5,0,0xf5daa3,.8)]);
       this.tweens.add({targets:fish,x:fish.x+39,y:fish.y-3,duration:3800+i*500,yoyo:true,repeat:-1});
      }
      for(let i=0;i<34;i++){
       const p=this.add.rectangle((i*127)%W,(i*97)%H,3+(i%2)*2,3,[0xffc3ce,0xffd5d9,0xf7b4d1][i%3],.8).setDepth(45);
       this.tweens.add({targets:p,y:p.y+155,x:p.x+84,angle:160,duration:6500+i*170,repeat:-1,delay:i*110,onRepeat:()=>p.setPosition((i*127)%W,(i*97)%H)});
      }
      for(let i=0;i<9;i++){
       const fly=this.add.circle(150+i*95,360+(i%3)*90,2,0xffe9a0,.65).setDepth(44);
       this.tweens.add({targets:fly,alpha:.05,y:fly.y-20,duration:1000+i*190,yoyo:true,repeat:-1});
      }
     }
     this.pathInk=this.add.graphics().setDepth(8);
     const saved=live.current.worldState;const sx=Number.isFinite(saved?.x)?saved.x:540,sy=Number.isFinite(saved?.y)?saved.y:613;
     this.player=this.add.sprite(sx,sy,'explorer').setScale(2.1).setDepth(30);
     this.playerShadow=this.add.ellipse(sx,sy+19,31,11,0x153d45,.35).setDepth(29);
     this.playerRing=this.add.ellipse(sx,sy+18,40,17).setStrokeStyle(1,0xf7d689,.7).setDepth(28);
     this.cameras.main.setZoom(compact?1:1.15);
     this.cameras.main.startFollow(this.player,true,.09,.09);
     if(compact){this.cameras.main.stopFollow();this.cameras.main.centerOn(W/2,H/2)}
     this.lastOverview=compact;this.lastActive=-1;this.lastDone='';this.path=[];this.arrival=null;this.moveTime=0;this.idleAt=0;this.dirty=false;this.lastSave=0;
     this.keys=this.input.keyboard.createCursorKeys();this.wasd=this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
     this.input.keyboard.enabled=false;this.input.keyboard.disableGlobalCapture();
     const canvas=this.game.canvas;canvas.setAttribute('tabindex','0');canvas.setAttribute('aria-label','Sakura island game. Click to walk, use arrows or WASD, and press E near a mentor. Quest buttons are available below the map.');
     const focus=()=>{const keyboard=this.input?.keyboard;if(!keyboard?.manager)return;keyboard.enabled=true;keyboard.enableGlobalCapture()};
     const blur=()=>{const keyboard=this.input?.keyboard;if(keyboard?.manager){keyboard.enabled=false;keyboard.disableGlobalCapture();keyboard.resetKeys()}controls.current.x=0;controls.current.y=0};
     canvas.addEventListener('focus',focus);canvas.addEventListener('blur',blur);
     detachInputs=()=>{canvas.removeEventListener('focus',focus);canvas.removeEventListener('blur',blur);blur()};
     this.input.on('pointerdown',(pointer,objects)=>{
      if(objects.length||compact)return;
      const p=this.cameras.main.getWorldPoint(pointer.x,pointer.y);
      if(walkable(p.x,p.y,this.solids))this.goTo(p.x,p.y);
     });
     this.input.keyboard.on('keydown',()=>{this.path=[];this.arrival=null});
     setLoaded(true);
    }
    goTo(x,y,arrival=null){
     if(compact){if(arrival!==null)live.current.onVisit(arrival);return}
     this.path=findPath(this.player.x,this.player.y,x,y,this.solids);this.arrival=arrival;
     if(!this.path.length){if(Math.hypot(this.player.x-x,this.player.y-y)<28&&arrival!==null)live.current.onVisit(arrival);else setTip('Choose a clear path, or use the quest buttons below.')}
     else setTip(arrival!==null?'On the way to '+places[arrival].npc+'…':'Exploring Sakura Island…');
    }
    publish(){
     live.current.onWorldChange?.({x:Math.round(this.player.x),y:Math.round(this.player.y),scrolls:[...this.collected]});this.dirty=false;
    }
    update(time,dt){
     if(!this.player)return;
     const input=controls.current,ref=live.current;
     if(!compact&&this.lastOverview!==input.overview){
      this.lastOverview=input.overview;
      if(input.overview){this.cameras.main.stopFollow();this.cameras.main.setZoom(Math.min(this.scale.width/W,this.scale.height/H));this.cameras.main.centerOn(W/2,H/2)}
      else{this.cameras.main.setZoom(1.15);this.cameras.main.startFollow(this.player,true,.09,.09)}
     }
     if(input.recenter){this.player.setPosition(540,613);this.path=[];this.arrival=null;input.recenter=false;this.dirty=true}
     const d=ref.done.join(',');
     if(ref.active!==this.lastActive||d!==this.lastDone){
      this.lastActive=ref.active;this.lastDone=d;
      this.markers.forEach((marker,i)=>marker.setText(ref.done.includes(i)?'✓':i===ref.active?'!':'◆').setColor(ref.done.includes(i)?'#b4ee9a':i===ref.active?'#ffe19b':'#b2cedb'));
      this.banners.forEach((t,i)=>t.setAlpha(i>ref.done.length ? .72 : 1));
     }
     let dx=input.x,dy=input.y;
     if(this.input.keyboard.enabled&&!compact){
      if(this.keys.left.isDown||this.wasd.A.isDown)dx=-1;if(this.keys.right.isDown||this.wasd.D.isDown)dx=1;
      if(this.keys.up.isDown||this.wasd.W.isDown)dy=-1;if(this.keys.down.isDown||this.wasd.S.isDown)dy=1;
     }
     const manual=dx!==0||dy!==0;
     if(manual){this.path=[];this.arrival=null}
     let moving=manual;
     if(!manual&&this.path.length){
      const point=this.path[0],dist=Math.hypot(point.x-this.player.x,point.y-this.player.y);
      if(dist<5){this.path.shift();if(!this.path.length&&this.arrival!==null){const target=this.arrival;this.arrival=null;this.publish();live.current.onVisit(target)}}
      else{dx=(point.x-this.player.x)/dist;dy=(point.y-this.player.y)/dist;moving=true}
     }
     if(moving&&!compact){
      const norm=Math.max(1,Math.hypot(dx,dy)),speed=Math.min(dt,40)*.135,nx=this.player.x+dx/norm*speed,ny=this.player.y+dy/norm*speed;
      if(walkable(nx,this.player.y,this.solids))this.player.x=nx;
      if(walkable(this.player.x,ny,this.solids))this.player.y=ny;
      this.moveTime+=dt;this.player.setTexture(Math.floor(this.moveTime/120)%2?'explorer-step':'explorer');if(dx)this.player.setFlipX(dx<0);this.dirty=true;this.idleAt=time;
     }else this.player.setTexture('explorer');
     this.playerShadow.setPosition(this.player.x,this.player.y+19);this.playerRing.setPosition(this.player.x,this.player.y+19).setAlpha(reduced?.5:.4+Math.sin(time*.003)*.15);
     this.pathInk.clear();if(this.path.length){this.path.forEach((p,i)=>{if(i%3===0)this.pathInk.fillStyle(0xffedb5,.65).fillRect(p.x-2,p.y-2,4,4)})}
     if(!compact){
      const nearest=places.findIndex(p=>Math.hypot(this.player.x-(p.x+20),this.player.y-(p.y+40))<85);
      if(nearest!==this.nearest){this.nearest=nearest;setNear(nearest);if(nearest>=0)setTip(places[nearest].npc+' is here. Press E or tap Talk to begin the challenge.')}
      if((this.input.keyboard.enabled&&(P.Input.Keyboard.JustDown(this.wasd.E)||P.Input.Keyboard.JustDown(this.wasd.SPACE)))||input.interact){input.interact=false;if(nearest>=0){this.publish();live.current.onVisit(nearest)}else setTip('Walk closer to a mentor or choose a quest below.')}
      scrolls.forEach((s,i)=>{if(!this.collected.has(i)&&Math.hypot(this.player.x-s.x,this.player.y-s.y)<27){
       this.collected.add(i);setCollected(this.collected.size);setTip('SCROLL '+this.collected.size+'/5 · '+s.text);
       const item=this.scrollSprites[i];if(item){if(reduced){item.sprite.destroy();item.glow.destroy()}else this.tweens.add({targets:[item.sprite,item.glow],alpha:0,y:item.sprite.y-35,duration:450,onComplete:()=>{item.sprite.destroy();item.glow.destroy()}})}
       this.publish();
      }});
      if(this.dirty&&time-this.idleAt>350&&time-this.lastSave>900){this.publish();this.lastSave=time}
     }
    }
   }
   controls.current.overview=compact;
   game=new P.Game({type:P.CANVAS,width:!compact&&narrow?720:W,height:H,parent:host.current,backgroundColor:'#237a9c',pixelArt:true,roundPixels:true,scene:Island,scale:{mode:P.Scale.FIT,autoCenter:P.Scale.CENTER_BOTH},audio:{noAudio:true},banner:false});
  }).catch(()=>{setError(true);setLoaded(true)});
  return()=>{stopped=true;detachInputs();if(game)game.destroy(true)};
 },[reduced,compact,narrow]);
 const move=(e,x,y)=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);controls.current.x=x;controls.current.y=y};
 const stop=()=>{controls.current.x=0;controls.current.y=0};
 return <div className={'village-wrap world-v2 '+(compact?'compact ':'')+(maximized?'world-maximized':'')}>
 <div className="map-topline"><span><span className="world-sigil">✦</span> SAKURA ISLAND <small>CHAPTER 05 · IT GUARDIAN</small></span><div className="world-toolbar"><button onClick={()=>{setOverview(!overview);controls.current.overview=!overview}} aria-label={overview?'Follow character':'Show island overview'}><Map size={15}/><span>{overview?'Follow':'Map'}</span></button><button onClick={toggleMusic} aria-label={music?'Mute music':'Enable music'}>{music?<Volume2 size={15}/>:<VolumeX size={15}/>}</button><button onClick={()=>setMaximized(!maximized)} aria-label={maximized?'Exit large game view':'Expand game view'}>{maximized?<Minimize2 size={15}/>:<Maximize2 size={15}/>}</button></div></div>
 <div className="world-stage"><div ref={host} className="village-canvas"/>
 {!loaded&&<div className="world-loading"><span>✦</span>Opening the island…</div>}
 {!compact&&<><div className="world-hud"><span><Compass size={16}/><b>THE VILLAGE AWAKENS</b><small>{done.length}/5 quests complete</small></span><span><BookOpen size={15}/>{collected}/5 scrolls</span></div><div className="world-location"><span className="live-dot"/>{near>=0?places[near].short:'SAKURA COMMONS'}<small>SPRING · LANTERN FESTIVAL</small></div><div className="touch-controls" aria-label="Character movement controls"><button aria-label="Walk up" className="up" onPointerDown={e=>move(e,0,-1)} onPointerUp={stop} onPointerCancel={stop}><ArrowUp size={21}/></button><button aria-label="Walk left" className="left" onPointerDown={e=>move(e,-1,0)} onPointerUp={stop} onPointerCancel={stop}><ArrowLeft size={21}/></button><button aria-label="Walk down" className="down" onPointerDown={e=>move(e,0,1)} onPointerUp={stop} onPointerCancel={stop}><ArrowDown size={21}/></button><button aria-label="Walk right" className="right" onPointerDown={e=>move(e,1,0)} onPointerUp={stop} onPointerCancel={stop}><ArrowRight size={21}/></button></div><button className="world-talk" onClick={()=>{controls.current.interact=true}}>TALK <kbd>E</kbd></button></>}
 </div>
 {error&&<p className="map-fallback">Map unavailable. Use the quest buttons below to continue.</p>}
 <div className="world-dialogue"><span className="portrait-fox" aria-hidden="true"><svg viewBox="0 0 32 32" shapeRendering="crispEdges"><path fill="#70503e" d="M4 2h7v4h10V2h7v19h-4v4H8v-4H4z"/><path fill="#d99960" d="M6 4h3v4h14V4h3v15h-3v4H9v-4H6z"/><path fill="#ffe5ba" d="M7 12h7v8h4v-8h7v7h-4v5H11v-5H7z"/><path fill="#fffbee" d="M8 12h5v4H8zm11 0h5v4h-5z"/><path fill="#253b44" d="M10 13h3v5h-3zm9 0h3v5h-3zm-5 5h4v3h-4z"/><path fill="#efc3a0" d="M8 19h3v2H8zm13 0h3v2h-3z"/><path fill="#b54d48" d="M9 25h14v4H9z"/><path fill="#f4c96f" d="M15 25h3v7h-3z"/><path fill="#337f80" d="M8 29h16v3H8z"/></svg></span><span><b>{near>=0?places[near].npc.toUpperCase():'YOUR FIELD GUIDE'}</b>{tip}</span></div>
 <div className="map-legend"><span><kbd>W A S D</kbd> / arrows to walk</span><span>Click a path to move · E to talk</span><button onClick={()=>{controls.current.recenter=true;setTip('Back at the village entrance. Your saved quests and scrolls are unchanged.')}}>Return to entrance</button></div>
 <div className="map-stops">{places.map((p,i)=><button key={p.name} className={i===active?'current':''} onClick={()=>onVisit(i)} aria-label={'Visit '+p.name}><b>{done.includes(i)?'✓':String(i+1).padStart(2,'0')}</b><span>{p.name}</span></button>)}</div>
 </div>
}
