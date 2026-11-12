/* Independent FiveStory loader: sync scripts load locally from this repository. */
(function(){'use strict';
if(!new URLSearchParams(location.search).has('sync')||window.__TIMER)return;
const ready=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):fn();
ready(async function(){
 let badge=document.getElementById('syncState');
 if(!badge){badge=document.createElement('div');badge.id='syncState';document.body.appendChild(badge)}
 badge.style.cssText='position:fixed!important;top:8px!important;left:8px!important;z-index:2147483647!important;padding:8px 12px!important;border-radius:18px!important;background:#222!important;color:white!important;font:14px sans-serif!important;display:block!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;';
 const load=src=>new Promise((resolve,reject)=>{let script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error('無法載入 '+src));document.head.appendChild(script)});
 try{
  badge.textContent='同步：正在載入…';
  if(!window.firebase?.apps)await load('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
  if(!window.firebase?.database)await load('https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js');
  if(!window.FIVESTORY_FIREBASE_CONFIG)await load('./sync-config.js?v=independent1');
  await load('./sync.js?v=independent104');
  await load('./bullseye-sync.js?v=independent1');
  await load('./video-sync.js?v=independent3');
  await load('./video-list-sync.js?v=independent1');
  await load('./mobile-red-fix.js?v=independent1');
  await load('./practice-sync.js?v=2');
  await load('./games-nav-sync.js?v=1');
  await load('./satir-sync.js?v=2');
  await load('./dilemma-sync.js?v=2');
  await load('./ai-sync.js?v=3');
  await load('./practice-timer-sync.js?v=6');
  await load('./nav-buttons.js?v=27');
  if(badge.textContent==='同步：正在載入…')badge.textContent='同步主程式尚未啟動';
 }catch(err){badge.textContent='同步載入失敗：'+err.message;console.error(err)}
});
})();
