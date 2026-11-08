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
  close.innerHTML=ICON_STORY;close.title='返回故事';close.setAttribute('aria-label','返回故事');
  // 返回故事：放在黑色列最右邊（左上角會被同步狀態蓋住）、紅底大按鈕，一眼就看得到
  close.style.cssText='order:99;width:48px;height:48px;padding:0;border:0;border-radius:50%;justify-content:center;background:#D2262E;color:#fff;display:inline-flex;align-items:center;gap:8px;font:900 18px "Noto Sans TC","Microsoft JhengHei",sans-serif;cursor:pointer;flex:none;box-shadow:0 3px 10px rgba(0,0,0,.4)';
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
  /* 2026-11-04：清單圖示（返回練習目錄）不再顯示，改用底下藍色「練習」圖示回目錄 */
  menu.style.setProperty('display','none','important');
  // 練習網站底下也放一排和簡報相同的八顆圖示（左：影片、說書人、練習；右：靶心人、五大類、末頁、上一頁、首頁）
  const bottom=document.createElement('div');bottom.id='syncBottomBar';
  bottom.style.cssText='display:none;flex:none;justify-content:space-between;align-items:center;padding:8px 16px;background:#000;min-height:64px;box-sizing:border-box';
  const mk=(sel,color)=>{const src=document.querySelector(sel);if(!src)return null;const b=document.createElement('button');b.type='button';
    b.innerHTML=(src.querySelector('svg')||src).outerHTML;b.title=src.title||'';b.setAttribute('aria-label',src.getAttribute('aria-label')||src.title||'');
    b.style.cssText='width:48px;height:48px;padding:0;border:0;border-radius:50%;background:'+color+';color:#FBF8F3;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:none;box-shadow:0 3px 8px rgba(0,0,0,.4)';
    const sv=b.querySelector('svg');if(sv){sv.setAttribute('width','26');sv.setAttribute('height','26');sv.style.width='26px';sv.style.height='26px';sv.setAttribute('stroke',sv.getAttribute('stroke')==='currentColor'?'currentColor':'#FBF8F3');}
    b._src=src;return b;};
  const group=()=>{const g=document.createElement('div');g.style.cssText='display:flex;gap:12px;align-items:center';return g;};
  const L=group(),R=group();
  /* 2026-11-04：遊戲已搬到獨立的 games 專案，「遊戲」圖示和其他藍色圖示一樣，由 sync.js 開在同步視窗裡。 */
  ['a.navPill[data-sync-video=resources]','a.navPill[href="https://bobayhsu.github.io/bullseye/"]','a.navPill[href="https://bobayhsu.github.io/practice/"]','a.navPill[data-games]','a.navPill[data-satir]','a.navPill[data-download]'].forEach(sel=>{const b=mk(sel,'#1F5FA8');if(!b)return;L.appendChild(b);
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();
      const h=b._src.getAttribute('href');
      if((h===BASE||h==='https://bobayhsu.github.io/games/'||h==='https://bobayhsu.github.io/fivestory/satir/')&&document.getElementById('syncExternalOpen')?.href===h){frame.src=h;return;} // 已經開著：回到該網站的目錄
      b._src.click();});});
  ['div.navPill[data-jump=formula]','div.navPill[data-jump=types]','#endBtn','#backBtn','#home'].forEach(sel=>{const b=mk(sel,'#1E1C1A');if(!b)return;R.appendChild(b);
    b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();close.click();setTimeout(()=>b._src.click(),60);});});
  bottom.append(L,R);layer.appendChild(bottom);
  const st2=document.createElement('style');
  st2.textContent='#fivestorySyncedExternal.withBottom #syncExternalFrame{width:min(100vw,calc((100vh - 132px)*16/9))!important}';
  document.head.appendChild(st2);
  /* 2026-11-04：所有超連結出去的網頁（說書人、影片資源、練習、YouTube）底下都顯示這排圖示 */
  setInterval(()=>{const on=layer.style.display!=='none';
    bottom.style.display=on?'flex':'none';layer.classList.toggle('withBottom',on);},400);
  /* 2026-11-04：外部網頁和簡報同一個版面——
     網頁放在和投影片一樣大的範圍（同位置、同大小），拿掉上方黑色列；
     底下八顆圖示和簡報上的圖示同大小、同位置；返回故事鈕縮小，放在右上角。 */
  const topBar=close.parentElement, stage=document.getElementById('stage');
  const imp=(el,k,v)=>el.style.setProperty(k,v,'important');
  const titleEl=document.getElementById('syncExternalTitle');if(titleEl)imp(titleEl,'visibility','hidden');
  imp(topBar,'position','absolute');imp(topBar,'background','transparent');imp(topBar,'min-height','0');imp(topBar,'padding','0');
  imp(topBar,'z-index','3');imp(topBar,'pointer-events','none');imp(topBar,'gap','8px');
  [close,menu].forEach(b=>{imp(b,'pointer-events','auto');});
  imp(bottom,'position','absolute');imp(bottom,'inset','0');imp(bottom,'background','transparent');imp(bottom,'padding','0');
  imp(bottom,'min-height','0');imp(bottom,'pointer-events','none');imp(bottom,'z-index','2');
  [L,R].forEach(g=>imp(g,'display','contents'));
  const copies=[...bottom.querySelectorAll('button')];
  copies.forEach(b=>{imp(b,'position','absolute');imp(b,'pointer-events','auto');imp(b,'box-shadow','0 2px 6px rgba(0,0,0,.35)');});
  const layout=()=>{
    if(layer.style.display==='none'||!stage)return;
    const r=stage.getBoundingClientRect();if(!r.width)return;
    imp(layer,'background',getComputedStyle(document.body).backgroundColor||'#000');
    imp(frame,'position','absolute');imp(frame,'margin','0');imp(frame,'aspect-ratio','auto');imp(frame,'flex','none');
    imp(frame,'left',r.left+'px');imp(frame,'top',r.top+'px');imp(frame,'width',r.width+'px');imp(frame,'height',r.height+'px');
    const s=Math.round(r.width*42/1436);
    imp(topBar,'top',(r.top+12)+'px');imp(topBar,'right',(innerWidth-r.right+12)+'px');imp(topBar,'left','auto');
    [close,menu].forEach(b=>{imp(b,'width',s+'px');imp(b,'height',s+'px');});
    copies.forEach(b=>{const q=b._src&&b._src.getBoundingClientRect();if(!q||!q.width)return;
      imp(b,'left',q.left+'px');imp(b,'top',q.top+'px');imp(b,'width',q.width+'px');imp(b,'height',q.height+'px');
      const sv=b.querySelector('svg');if(sv){const z=Math.round(q.width*.55)+'px';sv.style.width=z;sv.style.height=z;}});
  };
  setInterval(layout,400);addEventListener('resize',()=>setTimeout(layout,50));
  // 上方黑色列的點擊（書本鈕等）不要傳到投影片；投影片的「點空白處前進」會讓底下翻到下一頁
  layer.addEventListener('click',e=>e.stopPropagation());
},100);
})();
