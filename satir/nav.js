/* 翻頁、點一下出現下一句、選單開關、左右滑動；並提供同步用的介面 window.SatirSync */
(function(){
  try{ if (window.self !== window.top) document.body.classList.add('embedded'); }catch(e){ document.body.classList.add('embedded'); }
  var fb = document.getElementById('fsBack'); if (fb) fb.onclick = function(){ history.back(); };

  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var ids = slides.map(function(s){ return s.id; });

  /* 舊網址（#s1、#s5…）自動轉到新代號 */
  var OLD = { s1:'home', s2:'novel', s4:'combos', s21:'scenes', s22:'scenes', s23:'scenes' };
  for (var k = 5; k <= 20; k++) OLD['s' + k] = 'combo-' + (k - 4);
  for (var k2 = 24; k2 <= 38; k2++) OLD['s' + k2] = 'scene-' + (k2 - 23);
  function fixOld(){ var h = location.hash.slice(1); if (OLD[h]) history.replaceState(null, '', location.pathname + location.search + '#' + OLD[h]); }
  fixOld();

  function cur(){ var i = ids.indexOf(location.hash.slice(1)); return i < 0 ? 0 : i; }
  function steps(){ return [].slice.call(slides[cur()].querySelectorAll('.lines p.step')); }
  function shownCount(){ return steps().filter(function(p){ return p.classList.contains('shown'); }).length; }
  function setShown(n){
    var st = steps();
    st.forEach(function(p, k){ p.classList.toggle('shown', k < n); });
    var dl = slides[cur()].querySelector('.dlg'); if (dl) dl.classList.toggle('done', n >= st.length);
    changed();
  }

  var backward = false, pendingShown = null;
  function show(){
    var i = cur();
    slides.forEach(function(s, k){ s.classList.toggle('on', k === i); });
    document.getElementById('count').textContent = (i + 1) + ' / ' + slides.length;
    var n = pendingShown != null ? pendingShown : (backward ? 999 : 0);
    pendingShown = null; backward = false;
    setShown(n);
    var sc = slides[i].querySelector('.stage'); if (sc) sc.scrollTop = 0;
    /* 影片頁：進來才載入影片，離開就停掉（不然看不到的影片會繼續播聲音） */
    slides.forEach(function(s, k){
      var f = s.querySelector('iframe[data-src]'); if (!f) return;
      if (k === i){ if (!f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src')); }
      else if (f.getAttribute('src')) f.removeAttribute('src');
    });
  }
  function go(d){
    var st = steps(), n = shownCount();
    if (d > 0 && n < st.length){ setShown(n + 1); return; }
    if (d < 0 && n > 0 && st.length){ setShown(n - 1); return; }
    var i = Math.max(0, Math.min(slides.length - 1, cur() + d));
    if (i === cur()) return;
    backward = d < 0; location.hash = ids[i];
  }

  document.addEventListener('click', function(e){
    var w = e.target.closest('.wbs-btn');
    document.querySelectorAll('.wbs').forEach(function(x){ if (!w || x !== w.parentNode) x.classList.remove('open'); });
    if (w){ w.parentNode.classList.toggle('open'); return; }
    if (e.target.closest('a,button')) return;
    if (e.target.closest('.dlg')){ var st = steps(), n = shownCount(); if (n < st.length) setShown(n + 1); }
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){ e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp'){ e.preventDefault(); go(-1); }
  });
  /* 左右滑動翻頁（直拿時上下捲動不受影響） */
  var x0 = null, y0 = null;
  document.addEventListener('touchstart', function(e){ x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, {passive:true});
  document.addEventListener('touchend', function(e){
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
    x0 = null;
  }, {passive:true});
  window.addEventListener('hashchange', function(){ fixOld(); show(); });

  /* ---- 同步用：五大類故事的同步程式透過這裡讀取、設定目前狀態 ---- */
  var listeners = [];
  function state(){ return { page: ids[cur()], shown: shownCount() }; }
  function changed(){ var s = state(); listeners.forEach(function(f){ try{ f(s); }catch(_){} }); }
  window.SatirSync = {
    get: state,
    set: function(s){
      if (!s || ids.indexOf(s.page) < 0) return;
      if (s.page !== ids[cur()]){ pendingShown = s.shown || 0; location.hash = s.page; }
      else if (s.shown !== shownCount()) setShown(s.shown || 0);
    },
    onChange: function(f){ listeners.push(f); }
  };

  show();
})();
