/* 翻頁、點一下出現下一句、選單開關、左右滑動 */
(function(){
  try{if(window.self!==window.top)document.body.classList.add('embedded')}catch(e){document.body.classList.add('embedded')}
  var fb=document.getElementById('fsBack');if(fb)fb.onclick=function(){history.back()};
  var slides=[].slice.call(document.querySelectorAll('.slide'));
  var ids=slides.map(function(s){return s.id});
  function cur(){var h=location.hash.slice(1);var i=ids.indexOf(h);return i<0?0:i}
  function show(){
    var i=cur();
    slides.forEach(function(s,k){s.classList.toggle('on',k===i)});
    document.getElementById('count').textContent=(i+1)+' / '+slides.length;
    setShown(backward?999:0);backward=false;
  }
  var backward=false;
  function steps(){return [].slice.call(slides[cur()].querySelectorAll('.lines p.step'))}
  function setShown(n){var st=steps();st.forEach(function(p,k){p.classList.toggle('shown',k<n)});
    var dl=slides[cur()].querySelector('.dlg');if(dl)dl.classList.toggle('done',n>=st.length)}
  function shownCount(){return steps().filter(function(p){return p.classList.contains('shown')}).length}
  function go(d){
    var st=steps(),n=shownCount();
    if(d>0&&n<st.length){setShown(n+1);return}
    if(d<0&&n>0&&st.length){setShown(n-1);return}
    var i=Math.max(0,Math.min(slides.length-1,cur()+d));backward=d<0;location.hash=ids[i]}
  document.addEventListener('click',function(e){
    var w=e.target.closest('.wbs-btn');document.querySelectorAll('.wbs').forEach(function(x){if(!w||x!==w.parentNode)x.classList.remove('open')});if(w){w.parentNode.classList.toggle('open');return}
    if(e.target.closest('a,button'))return;
    if(e.target.closest('.dlg')){var st=steps(),n=shownCount();if(n<st.length)setShown(n+1)}
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(1)}
    else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(-1)}
  });
  var x0=null,y0=null;var rot=function(){return getComputedStyle(document.getElementById('app')).transform!=='none'};
  document.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;y0=e.touches[0].clientY},{passive:true});
  document.addEventListener('touchend',function(e){if(x0===null)return;var dx=rot()?e.changedTouches[0].clientY-y0:e.changedTouches[0].clientX-x0;if(Math.abs(dx)>60)go(dx<0?1:-1);x0=null},{passive:true});
  window.addEventListener('hashchange',show);
  show();
})();
