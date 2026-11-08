/* FiveStory 薩提爾同步（2026-11-08）
   薩提爾網頁開在同步視窗裡時，手機和桌機同步：換頁、每一句台詞出現。
   做法同 practice-sync.js：從同步視窗讀出薩提爾的狀態（window.SatirSync），有變化就寫進 Firebase，
   另一台收到後套用。不修改 sync.js。 */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(!params.has('sync')||!window.firebase?.database||window.__TIMER)return;
const room=params.get('sync')||'demo';
if(!/^[A-Za-z0-9_-]{4,60}$/.test(room))return;
const frame=document.getElementById('syncExternalFrame');
const layer=document.getElementById('fivestorySyncedExternal');
if(!frame||!layer)return;
const HOME='https://bobayhsu.github.io/fivestory/satir/';
const ref=firebase.database().ref('rooms/'+room+'/screen/satirNav');
const node='satir-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let seen='', remote=null, latestAction='', firstSnapshot=true;
const active=()=>layer.style.display!=='none'&&frame.getAttribute('src')!==null&&
  document.getElementById('syncExternalOpen')?.href===HOME;
const api=()=>{try{return frame.contentWindow.SatirSync||null}catch(_){return null}};
const key=s=>s?s.page+'|'+s.shown:'';
function publish(s){
 ref.set({page:s.page,shown:s.shown,source:node,at:firebase.database.ServerValue.TIMESTAMP})
 .catch(err=>console.warn('薩提爾同步寫入失敗',err));
}
function apply(){
 const a=api();if(!active()||!a||!remote)return;
 if(key(a.get())===key(remote)){seen=key(remote);remote=null;return;}
 seen=key(remote);a.set(remote);
}
function observe(){
 if(!active()){seen='';return;}
 const a=api();if(!a)return;
 if(remote){apply();return;}            // 正在套用另一台的狀態
 const s=a.get(),k=key(s);
 if(!seen){seen=k;return;}              // 剛打開：先記下，不送出
 if(k!==seen){seen=k;publish(s);}       // 這台有人點了：送出
}
frame.addEventListener('load',()=>{seen='';setTimeout(()=>{if(remote)apply();},300);hookLinks();});
/* 2026-11-08：標題「薩提爾」連到 YouTube——不另開分頁，改在同步視窗裡播放，兩台一起打開 */
const VIDEO='https://www.youtube.com/watch?v=4gUPQSsD8JU';
function hookLinks(){
 if(!active())return;
 let doc;try{doc=frame.contentDocument;}catch(_){return;}
 if(!doc||doc.__satirVideoHook)return;doc.__satirVideoHook=true;
 doc.addEventListener('click',e=>{
  const a=e.target.closest&&e.target.closest('a[href]');if(!a||a.href!==VIDEO)return;
  e.preventDefault();e.stopPropagation();
  const t=document.createElement('a');t.href=VIDEO;t.style.display='none';document.body.appendChild(t);t.click();t.remove();
 },true);
}
setInterval(hookLinks,1000);
/* 2026-11-08：開著薩提爾時，不顯示右上角紅色「返回故事」圖示（會蓋到薩提爾的選單；改用底部圖示回去） */
const hide=document.createElement('style');
hide.textContent='#fivestorySyncedExternal.satirOn #syncExternalClose{display:none!important}';
document.head.appendChild(hide);
setInterval(()=>layer.classList.toggle('satirOn',active()),300);
ref.on('value',snap=>{
 const cmd=snap.val();
 if(firstSnapshot){firstSnapshot=false;return;}
 if(!cmd||cmd.source===node||typeof cmd.page!=='string')return;
 const action=String(cmd.source)+':'+String(cmd.at)+':'+cmd.page+':'+cmd.shown;
 if(action===latestAction)return;
 latestAction=action;
 remote={page:cmd.page,shown:+cmd.shown||0};
 apply();
},err=>console.warn('薩提爾同步讀取失敗',err));
setInterval(observe,250);
})();
