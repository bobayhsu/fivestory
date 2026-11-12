/* 依 content.js（window.SATIR）產生所有頁面。改內容請改 content.js，不用動這裡。 */
(function(){
  var D = window.SATIR;
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;'); };
  var POSES = ['指責','討好','超理智','打岔'];
  var short = function(p){ return p === '超理智' ? '超' : p.charAt(0); };
  /* 頁面代號 */
  var PAGE = { home:'home', novel:'novel', combos:'combos', scenes:'scenes', shawshank:'shawshank', stillwalking:'stillwalking' };
  var comboId = function(i){ return 'combo-' + (i + 1); };
  var sceneId = function(i){ return 'scene-' + (i + 1); };

  function pie(ignored){
    var r = 46, c = 50, P = function(a){ a = a * Math.PI / 180; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    var secs = [['自我',150,270,-20,-10],['他人',270,390,20,-10],['情境',30,150,0,26]], s = '', t = '';
    secs.forEach(function(x){
      var p0 = P(x[1]), p1 = P(x[2]);
      var seg = '<path d="M50 50 L' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z"' + (ignored.indexOf(x[0]) >= 0 ? ' class="ig" fill="none"' : ' fill="#fff"') + '/>';
      if (ignored.indexOf(x[0]) >= 0) s = seg + s; else s += seg;  /* 鏤空的先畫，實心的邊線蓋在上面 */
      t += '<text x="' + (50 + x[3]) + '" y="' + (50 + x[4] + 4) + '"' + (ignored.indexOf(x[0]) >= 0 ? ' class="ig"' : '') + '>' + x[0] + '</text>';
    });
    return '<svg class="pie" viewBox="0 0 100 100">' + s + t + '</svg>';
  }
  function menu(){
    return '<div class="wbs"><button class="wbs-btn" type="button">' + esc(D['選單']['按鈕']) + '</button>\n<div class="wbs-menu">' +
      D['選單']['項目'].map(function(x){ if (Array.isArray(x[1])) return '<div class="wsub"><button type="button" class="wsub-btn">' + esc(x[0]) + '<span>▸</span></button><div class="wsub-menu">' + x[1].map(function(y){ return '<a href="#' + PAGE[y[1]] + '">' + esc(y[0]) + '</a>'; }).join('') + '</div></div>'; return '<a href="#' + PAGE[x[1]] + '">' + esc(x[0]) + '</a>'; }).join('') + '</div></div>';
  }
  function dialog(item){
    var h = '<div class="roles"><span class="role rf"><b>女</b>' + esc(item['女']) + '</span><span class="role rm"><b>男</b>' + esc(item['男']) + '</span></div><div class=\'lines\'>';
    item['台詞'].forEach(function(l){
      if (l['女'] != null) h += '<p class="step say f"><i>女</i><span>' + esc(l['女']) + '</span></p>';
      else if (l['男'] != null) h += '<p class="step say m"><i>男</i><span>' + esc(l['男']) + '</span></p>';
      else h += '<p class="step act">' + esc(l['動作']) + '</p>';
    });
    return h + '</div><span class=\'hint\'>點一下，出現下一句</span>';
  }
  /* 小組合表（右上角） */
  function mini(cur, list, idOf, title){
    var h = '<nav class="mini4" aria-label="16 種組合"><span class="mc"><i>女</i><i>男</i></span>' + POSES.map(function(p){ return '<span class="mh mf">' + short(p) + '</span>'; }).join('');
    for (var r = 0; r < 4; r++){
      h += '<span class="mh mm">' + short(POSES[r]) + '</span>';
      for (var c = 0; c < 4; c++){
        var i = r * 4 + c;
        if (i >= list.length){ h += '<span></span>'; continue; }
        h += '<a href="#' + idOf(i) + '" title="' + esc(title(i)) + '"' + (i === cur ? ' class=on' : '') + '>' + (i + 1) + '</a>';
      }
    }
    return h + '</nav>';
  }
  /* 大組合表 */
  function matrix(list, idOf, cell, extra){
    var h = '<table class="matrix bw"><colgroup><col style="width:16%">' + '<col style="width:21%">'.repeat(4) +
      '</colgroup><tr><th class="corner"><span class="cf">女</span><span class="cm">男</span></th>' +
      POSES.map(function(p){ return '<th class="col">' + p + '</th>'; }).join('') + '</tr>';
    for (var r = 0; r < 4; r++){
      h += '<tr><th class="rowh">' + POSES[r] + '</th>';
      for (var c = 0; c < 4; c++){ var i = r * 4 + c; h += i < list.length ? cell(i) : (extra || '<td></td>'); }
      h += '</tr>';
    }
    return h + '</table>';
  }
  var combos = D['對話組合']['組合'], scenes = D['場景意象']['場景'], cnn = D['奇景'];
  var comboTitle = function(i){ return String(i + 1); };
  var sceneTitle = function(i){ return (i + 1) + scenes[i]['地點'] + ' - ' + scenes[i]['意象']; };
  var pages = [];

  /* 首頁 */
  var T = D['標題'], L = D['標題連結'];
  var titleHtml = T.indexOf(L['文字']) === 0
    ? '<a class="tlink" href="#video" data-video="' + esc(L['網址']) + '" data-title="' + esc(L['說明'].replace(/（YouTube）$/, '')) + '" title="' + esc(L['說明']) + '">' + esc(L['文字']) + '</a>' + esc(T.slice(L['文字'].length))
    : esc(T);
  pages.push([PAGE.home, '<div class="cover2"><h1 class="ctitle">' + titleHtml + '</h1>\n' + menu() + '\n<div class="stances">' +
    D['四種姿態'].map(function(s){
      return '<div class="st"><div class="fig"><div class="sname">' + esc(s['名稱']) + '</div><img src="' + esc(s['圖']) + '" alt="' + esc(s['名稱']) + '姿態" style="height:' + s['高度'] + '%"></div><div class="stag">' + esc(s['標籤']) + '</div>' + pie(s['忽略']) + '</div>';
    }).join('') + '</div>\n</div>']);

  /* 小說原文 */
  var N = D['小說原文'];
  pages.push([PAGE.novel, '<div class="essay"><h2 class="etitle">' + esc(N['標題']) + '</h2><p class="gap"></p>' +
    N['內文'].map(function(l){ return l ? '<p>' + esc(l) + '</p>' : '<p class="gap"></p>'; }).join('') + '</div>']);

  /* 對話組合表 */
  pages.push([PAGE.combos, '<h2 class="title">' + esc(D['對話組合']['標題']) + '</h2>' +
    matrix(combos, comboId, function(i){ return '<td><a href="#' + comboId(i) + '"><b>' + (i + 1) + '</b></a></td>'; })]);
  combos.forEach(function(c, i){
    pages.push([comboId(i), '<div class="dlg plain"><span class="no">' + (i + 1) + '</span>' + mini(i, combos, comboId, comboTitle) + dialog(c) + '</div>']);
  });

  /* 場景表 */
  pages.push([PAGE.scenes, '<h2 class="title">' + esc(D['場景意象']['標題']) + '</h2>' +
    matrix(scenes, sceneId, function(i){ return '<td><a class="scell" href="#' + sceneId(i) + '" title="' + esc(sceneTitle(i).replace(/^\d+/, '')) + '">' + (i + 1) + '.' + esc(scenes[i]['意象']) + '</a></td>'; },
      '<td class="thumb"><a href="' + esc(cnn['網址']) + '" target="_blank" rel="noopener" title="CNN 評選一生必去世界 15 大絕美奇景（另開視窗）"><img src="' + esc(cnn['封面圖']) + '" alt="CNN 15 大奇景"></a></td>')]);
  scenes.forEach(function(s, i){
    pages.push([sceneId(i), '<div class="scene" style="--bg:url(' + esc(s['背景圖']) + ')"><div class="shade"></div><div class="dlg photo"><span class="no">' + (i + 1) + '</span>' +
      mini(i, scenes, sceneId, sceneTitle) + '<h3 class="loc">' + esc(s['地點'] + ' - ' + s['意象']) + '</h3>' + dialog(s) + '</div></div>']);
  });

  /* 刺激1995：四種姿態、四個人的對話 */
  [['刺激1995', PAGE.shawshank], ['橫山家之味', PAGE.stillwalking]].forEach(function(pair){ var SH = D[pair[0]];
  if (SH){
    var who = {}; SH['角色'].forEach(function(r){ who[r['名']] = r['姿態']; });
    var sk = function(p){ return 's' + (POSES.indexOf(p) + 1); };
    var h = '<div class="dlg plain shaw"><h2 class="shT">' + esc(SH['標題']) + '<small>' + esc(SH['場景']) + '</small></h2><div class="roles">' +
      SH['角色'].map(function(r){ var two = r['實則'] || r['先']; if (!two) return '<span class="role ' + sk(r['姿態']) + '"><b>' + short(r['姿態']) + '</b>' + esc(r['名']) + '・' + esc(r['姿態']) + '</span>'; var a = r['實則'] ? r['姿態'] : r['先'], z = r['實則'] ? r['實則'] : r['姿態'], lab = r['實則'] ? '表面' + a + '／實則' + z : a + ' → ' + z; return '<span class="role two ' + sk(a) + ' ' + sk(z).replace('s','t') + '"><b>' + short(a) + '</b>' + esc(r['名']) + '・' + esc(lab) + '</span>'; }).join('') + '</div><div class=\'lines\'>';
    SH['台詞'].forEach(function(l){
      var ps = l['姿態'] || who[l['人']] || '';
      if (l['人'] != null) h += '<p class="step say ' + sk(ps) + '"><i>' + short(ps || '?') + '</i><span><em class="who">' + esc(l['人']) + '：</em>' + esc(l['說']) + '</span></p>';
      else if (l['問題'] != null) h += '<p class="step ask">' + esc(l['問題']) + '</p>';
      else h += '<p class="step act">' + esc(l['動作']) + '</p>';
    });
    pages.push([pair[1], h + '</div><span class=\'hint\'>點一下，出現下一句</span></div>']);
  } });

  /* 影片頁：點標題「薩提爾」進來，在網頁裡播放（同步模式下兩台一起） */
  var vid = (L['網址'].match(/[?&]v=([\w-]{11})/) || [])[1];
  if (vid) pages.push(['video', '<div class="vidpage"><h2 class="vtitle">' + esc(L['說明'].replace(/（YouTube）$/, '')) + '</h2><div class="vbox"><iframe data-src="https://www.youtube-nocookie.com/embed/' + vid + '?rel=0" title="' + esc(L['說明']) + '" allow="accelerometer;autoplay;encrypted-media;gyroscope;picture-in-picture;fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div></div>']);

  document.getElementById('slides').innerHTML = pages.map(function(p, k){
    return '<section class="slide" id="' + p[0] + '" data-n="' + (k + 1) + '"><div class="stage">' + p[1] + (p[0] !== PAGE.home ? menu() : '') + '</div></section>';
  }).join('');
  var cnt = document.getElementById('count'); if (cnt) cnt.textContent = '1 / ' + pages.length;
})();
/* 選單裡的子選單（白象似的群山）：點一下展開／收起 */
document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('.wsub-btn'); if (!b) return;
  e.stopPropagation(); e.preventDefault(); b.parentNode.classList.toggle('open');
}, true);
