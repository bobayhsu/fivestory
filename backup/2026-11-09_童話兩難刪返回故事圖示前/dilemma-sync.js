/* FiveStory 童話兩難同步（2026-11-09）
   童話兩難開在同步視窗裡時，手機和桌機同步：開始、每一題的選擇、第三條路、三把鑰匙、故事大綱、結果頁。
   做法同 satir-sync.js：從同步視窗讀出狀態（window.DilemmaSync），有變化就寫進 Firebase，另一台收到後套用。
   第三條路的輸入框文字不同步（各自填寫）。 */
(()=>{'use strict';
const params=new URLSearchParams(location.search);
if(!params.has('sync')||!window.firebase?.database||window.__TIMER)return;
const room=params.get('sync')||'demo';
if(!/^[A-Za-z0-9_-]{4,60}$/.test(room))return;
const frame=document.getElementById('syncExternalFrame');
const layer=document.getElementById('fivestorySyncedExternal');
if(!frame||!layer)return;
const HOME='https://bobayhsu.github.io/fivestory/dilemma/';
const ref=firebase.database().ref('rooms/'+room+'/screen/dilemmaNav');
const node='dilemma-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
let seen='', remote=null, latestAction='', firstSnapshot=true;
const active=()=>layer.style.display!=='none'&&frame.getAttribute('src')!==null&&
  document.getElementById('syncExternalOpen')?.href===HOME;
const api=()=>{try{return frame.contentWindow.DilemmaSync||null}catch(_){return null}};
function publish(s){
 ref.set({state:s,source:node,at:firebase.database.ServerValue.TIMESTAMP})
 .catch(err=>console.warn('童話兩難同步寫入失敗',err));
}
function apply(){
 const a=api();if(!active()||!a||!remote)return;
 if(a.get()===remote){seen=remote;remote=null;return;}
 seen=remote;a.set(remote);
}
function observe(){
 if(!active()){seen='';return;}
 const a=api();if(!a)return;
 if(remote){apply();return;}
 const s=a.get();
 if(!seen){seen=s;return;}
 if(s!==seen){seen=s;publish(s);}
}
frame.addEventListener('load',()=>{seen='';setTimeout(()=>{if(remote)apply();},300);});
ref.on('value',snap=>{
 const cmd=snap.val();
 if(firstSnapshot){firstSnapshot=false;return;}
 if(!cmd||cmd.source===node||typeof cmd.state!=='string')return;
 const action=String(cmd.source)+':'+String(cmd.at);
 if(action===latestAction)return;
 latestAction=action;
 remote=cmd.state;
 apply();
},err=>console.warn('童話兩難同步讀取失敗',err));
setInterval(observe,250);
})();
