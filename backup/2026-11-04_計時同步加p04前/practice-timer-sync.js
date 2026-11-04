/* FiveStory practice timer bridge V1.
   Mirrors p01/p02 native timer controls between clients in the same Firebase room.
   Does not modify the practice website or existing navigation bridge.
   Does not synchronize background music or fullscreen (browser-controlled).
*/
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(!params.has('sync')||!window.firebase?.database||window.__TIMER)return;
const room=params.get('sync')||'demo';
if(!/^[A-Za-z0-9_-]{4,60}$/.test(room))return;
const frame=document.getElementById('syncExternalFrame');
const layer=document.getElementById('fivestorySyncedExternal');
if(!frame||!layer)return;
const base='https://bobayhsu.github.io/practice/';
const ref=firebase.database().ref('rooms/'+room+'/screen/practiceTimerCommand');
const node='pt-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let seq=0, first=true, lastId='', attached=null, pending=null;
const active=()=>layer.style.display!=='none'&&document.getElementById('syncExternalOpen')?.href===base;
const page=()=>{
  if(!active())return '';
  try{
    const u=new URL(frame.contentWindow.location.href);
    if(u.origin!==new URL(base).origin || !u.pathname.startsWith('/practice/'))return '';
    const name=u.pathname.split('/').pop();
    return name==='p01.html'||name==='p02.html'||name==='p03.html'?name:'';
  }catch(_){return '';}
};
const doc=()=>{try{return frame.contentDocument;}catch(_){return null;}};
function isRunning(d){
  const t=d?.querySelector('#toggle');
  return !!t&&/暫停倒數/.test(t.getAttribute('aria-label')||t.title||'');
}
function send(action,extra={}){
  const pg=page();if(!pg)return;
  const id=node+'-'+(++seq);
  ref.set({id,source:node,page:pg,action,...extra,at:firebase.database.ServerValue.TIMESTAMP})
    .catch(e=>console.warn('[練習計時] 同步寫入失敗',e));
}
function onClick(e){
  if(!active()||!page()||!e.isTrusted)return;
  const b=e.target.closest?.('button');
  if(!b)return;
  const d=doc();if(!d)return;
  const minutes=b.getAttribute('data-minutes');
  if(minutes!==null && b.closest('.presets')){
    send('preset',{minutes:Number(minutes)});return;
  }
  if(b.id==='toggle'){
    send('running',{running:!isRunning(d)});return;
  }
  if(b.id==='addTime'){send('add30');return;}
  if(b.id==='reset'){send('reset');return;}
}
function onKey(e){
  if(!active()||!page()||!e.isTrusted||e.repeat||e.ctrlKey||e.metaKey||e.altKey)return;
  const d=doc();if(!d)return;
  if(page()==='p02.html'&&!d.querySelector('#pv.open'))return;
  const key=e.key;
  if([' ','PageDown','ArrowRight','ArrowDown'].includes(key))send('running',{running:!isRunning(d)});
  else if(['PageUp','ArrowLeft','ArrowUp'].includes(key))send('add30');
  else if(key==='r'||key==='R')send('reset');
  else {
    const presets={'1':1,'2':2,'3':3,'5':5,'7':7,'0':10};
    if(Object.prototype.hasOwnProperty.call(presets,key)){
      const m=presets[key];
      if(d.querySelector('[data-minutes="'+m+'"]'))send('preset',{minutes:m});
    }
  }
}
function attach(){
  const d=doc();
  if(!d||!page()||!d.querySelector('#toggle')||!d.querySelector('#time'))return;
  if(attached===d)return;
  if(attached){attached.removeEventListener('click',onClick,true);attached.removeEventListener('keydown',onKey,true);}
  attached=d;
  d.addEventListener('click',onClick,true);
  d.addEventListener('keydown',onKey,true);
  if(pending)applyPending();
}
function applyPending(){
  if(!pending)return;
  const cmd=pending;
  if(page()!==cmd.page)return;
  const d=doc();if(!d||!d.querySelector('#toggle')||!d.querySelector('#time'))return;
  pending=null;
  // Synthetic clicks are not rebroadcast (the capture listener only accepts isTrusted).
  if(cmd.action==='preset'){
    const m=Number(cmd.minutes);
    if([1,2,3,5,7,10].includes(m))d.querySelector('[data-minutes="'+m+'"]')?.click();
  }else if(cmd.action==='running'){
    const want=cmd.running===true;
    if(isRunning(d)!==want)d.querySelector('#toggle')?.click();
  }else if(cmd.action==='add30')d.querySelector('#addTime')?.click();
  else if(cmd.action==='reset')d.querySelector('#reset')?.click();
}
frame.addEventListener('load',()=>{attach();setTimeout(attach,100);setTimeout(attach,500)});
ref.on('value',snap=>{
  const cmd=snap.val();
  // Ignore stale action on initial subscription: this isn't a state snapshot.
  if(first){first=false;return;}
  if(!cmd||cmd.source===node||typeof cmd.id!=='string'||lastId===cmd.id)return;
  lastId=cmd.id;
  if(!['p01.html','p02.html','p03.html'].includes(cmd.page))return;
  if(!['preset','running','add30','reset'].includes(cmd.action))return;
  // Navigation is controlled by practice-sync.js. Don't switch pages for timer events.
  if(page()!==cmd.page)return;
  pending=cmd;
  applyPending();
},err=>console.warn('[練習計時] 同步讀取失敗',err));
setInterval(()=>{
  if(!active()){
    if(attached){attached.removeEventListener('click',onClick,true);attached.removeEventListener('keydown',onKey,true);attached=null;}
    pending=null;return;
  }
  attach();
  if(pending)applyPending();
},300);
})();
