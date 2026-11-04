/* FiveStory games bridge (2026-11-04): 遊戲目錄與遊戲之間的換頁同步（由 practice-sync.js 複製，只改網址與資料位置）。
   Does NOT synchronize exercise form fields, timers or scores. */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(!params.has('sync')||!window.firebase?.database||window.__TIMER)return;
const room=params.get('sync')||'demo';
if(!/^[A-Za-z0-9_-]{4,60}$/.test(room))return;
const frame=document.getElementById('syncExternalFrame');
const layer=document.getElementById('fivestorySyncedExternal');
if(!frame||!layer)return;
const base='https://bobayhsu.github.io/games/';
const home=new URL(base).href;
const navRef=firebase.database().ref('rooms/'+room+'/screen/gamesNav');
const node='practice-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let seen='', remotePending='', latestAction='', firstSnapshot=true;
const active=()=>layer.style.display!=='none'&&frame.getAttribute('src')!==null&&
  document.getElementById('syncExternalOpen')?.href===home;
function safe(raw){
 try{
  const u=new URL(raw,base), b=new URL(base);
  if(u.origin!==b.origin || !u.pathname.startsWith(b.pathname))return '';
  if(!(/\/$|\.html$/i.test(u.pathname)))return '';
  return u.href;
 }catch(_){return ''}
}
function current(){
 try{return safe(frame.contentWindow.location.href)}catch(_){return ''}
}
function publish(url){
 if(!active()||!url)return;
 navRef.set({url,source:node,at:firebase.database.ServerValue.TIMESTAMP})
 .catch(err=>console.warn('練習頁面同步寫入失敗',err));
}
function observe(){
 if(!active()){seen='';remotePending='';return;}
 const url=current();if(!url)return;
 if(remotePending){
  if(url===remotePending){seen=url;remotePending='';return;}
  return;
 }
 if(!seen){seen=url;return;}
 if(url!==seen){seen=url;publish(url);}
}
function follow(url){
 if(!active()||!url)return;
 const cur=current();
 if(cur===url){seen=url;remotePending='';return;}
 remotePending=url;
 seen=url;
 frame.src=url;
}
frame.addEventListener('load',()=>{
 if(!active())return;
 if(remotePending&&current()===remotePending){seen=remotePending;remotePending='';return;}
 observe();
 // Attach an early capture listener to catch location.replace() in the practice directory.
 try{
  const doc=frame.contentDocument;
  if(!doc||doc.__fivestoryPracticeBridge)return;
  doc.__fivestoryPracticeBridge=true;
  doc.addEventListener('click',event=>{
   if(!active())return;
   const a=event.target.closest?.('a[href]');if(!a)return;
   if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   const url=safe(a.href);
   if(!url||url===seen)return;
   seen=url;
   publish(url);
  },true);
 }catch(err){console.warn('無法監看練習目錄',err);}
});
navRef.on('value',snap=>{
 const cmd=snap.val();
 if(firstSnapshot){firstSnapshot=false;return;}
 if(!cmd||!safe(cmd.url)||cmd.source===node)return;
 const action=String(cmd.source)+':'+String(cmd.at)+':'+cmd.url;
 if(action===latestAction)return;
 latestAction=action;
 follow(safe(cmd.url));
},err=>console.warn('練習頁面同步讀取失敗',err));
setInterval(observe,300);
})();
