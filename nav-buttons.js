/* FiveStory nav buttons (2026-11)
   同步視窗上方黑色列：「返回故事」改成圖示，旁邊新增「返回練習目錄」圖示。
   不修改 sync.js；沿用原本的 #syncExternalClose，所以同步與其他程式照常運作。 */
(()=>{'use strict';
if(!new URLSearchParams(location.search).has('sync')||window.__TIMER)return;
const BASE='https://bobayhsu.github.io/practice/';
const ICON_STORY='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/></svg>';
const ICON_MENU='<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1.2" fill="currentColor"/><circle cx="4.5" cy="12" r="1.2" fill="currentColor"/><circle cx="4.5" cy="18" r="1.2" fill="currentColor"/></svg>';
const BTN='width:44px;height:44px;padding:0;border:0;border-radius:12px;background:#fff;color:#111;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:none';
let tries=0;
const timer=setInterval(()=>{
  const layer=document.getElementById('fivestorySyncedExternal');
  const close=document.getElementById('syncExternalClose');
  const frame=document.getElementById('syncExternalFrame');
  if(!layer||!close||!frame){if(++tries>100)clearInterval(timer);return;}
  clearInterval(timer);
  close.innerHTML=ICON_STORY+'<span>返回故事</span>';close.title='返回故事';close.setAttribute('aria-label','返回故事');
  // 返回故事：放在黑色列最左邊、紅底大按鈕，一眼就看得到
  close.style.cssText='order:-1;height:48px;padding:0 18px;border:0;border-radius:24px;background:#D2262E;color:#fff;display:inline-flex;align-items:center;gap:8px;font:900 18px "Noto Sans TC","Microsoft JhengHei",sans-serif;cursor:pointer;flex:none;box-shadow:0 3px 10px rgba(0,0,0,.4)';
  // 超連結出去的網頁：固定 16:9 大小，置中，不隨視窗拉長變形
  const st=document.createElement('style');
  st.textContent='#fivestorySyncedExternal{background:#000!important}#syncExternalFrame{flex:none!important;width:min(100vw,calc((100vh - 68px)*16/9))!important;height:auto!important;aspect-ratio:16/9;margin:auto!important}';
  document.head.appendChild(st);
  const menu=document.createElement('button');
  menu.type='button';menu.id='syncPracticeMenu';menu.innerHTML=ICON_MENU;
  menu.title='返回練習目錄';menu.setAttribute('aria-label','返回練習目錄');
  menu.style.cssText=BTN+';display:none';
  close.before(menu);
  menu.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();frame.src=BASE;});
  // 只在練習網站、而且不在目錄頁時顯示
  const inPractice=()=>{
    if(layer.style.display==='none')return false;
    if(document.getElementById('syncExternalOpen')?.href!==BASE)return false;
    try{const p=frame.contentWindow.location.pathname;return /\.html$/i.test(p)&&!/index\.html$/i.test(p);}catch(_){return false;}
  };
  setInterval(()=>{menu.style.display=inPractice()?'inline-flex':'none';},400);
  // 上方黑色列的點擊（書本鈕等）不要傳到投影片；投影片的「點空白處前進」會讓底下翻到下一頁
  layer.addEventListener('click',e=>e.stopPropagation());
},100);
})();
