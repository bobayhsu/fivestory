/* Test only: load the same synchronization scripts as the working production site.
   No file in fivestory production is modified. */
(function(){'use strict';
if(!new URLSearchParams(location.search).has('sync') || window.__TIMER)return;
function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn();}
ready(async function(){
 const badge=document.getElementById('syncState')||document.createElement('div');badge.id='syncState';if(!badge.isConnected)document.body.append(badge);
 badge.textContent='測試站同步程式載入中';badge.style.cssText='position:fixed;top:8px;left:8px;z-index:2147483647;padding:8px 12px;border-radius:18px;background:#222;color:#fff;font:14px sans-serif;';
 const load=src=>new Promise((ok,bad)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>bad(new Error('無法載入 '+src));document.head.appendChild(s)});
 const prod='https://bobayhsu.github.io/fivestory/';
 try{
   if(!window.firebase?.apps)await load('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
   if(!window.firebase?.database)await load('https://www.gstatic.com/firebasejs/10.14.1/firebase-database-compat.js');
   if(!window.FIVESTORY_FIREBASE_CONFIG)await load(prod+'sync-config.js');
   await load(prod+'sync.js?v=test1');
   await load(prod+'bullseye-sync.js?v=test1');
   await load(prod+'video-sync.js?v=test1');
   await load(prod+'video-list-sync.js?v=test1');
   await load(prod+'mobile-red-fix.js?v=test1');
 }catch(e){badge.textContent='測試站載入失敗：'+e.message;console.error(e)}
});
})();
