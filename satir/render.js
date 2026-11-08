/* 依 content.js（window.SATIR）產生所有頁面。改內容請改 content.js，不用動這裡。 */
(function(){
  var D = window.SATIR;
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;'); };
  var POSES = ['指責','討好','超理智','打岔'];
  var short = function(p){ return p === '超理智' ? '超' : p.charAt(0); };
  /* 頁面代號 */
  var PAGE = { home:'home', novel:'novel', combos:'combos', scenes:'scenes' };
  var comboId = function(i){ return 'combo-' + (i + 1); };
  var sceneId = function(i){ return 'scene-' + (i + 1); };

  function pie(ignored){
    var r = 46, c = 50, P = function(a){ a = a * Math.PI / 180; return [c + r * Math.cos(a), c + r * Math.sin(a)]; };
    var secs = [['自我',150,270,-20,-10],['他人',270,390,20,-10],['情境',30,150,0,26]], s = '', t = '';
    secs.forEach(function(x){
      var p0 = P(x[1]), p1 = P(x[2]);
      s += '<path d="M50 50 L' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' Z" fill="' + (ignored.indexOf(x[0]) >= 0 ? '#bdb8b0' : '#fff') + '"/>';
      t += '<text x="' + (50 + x[3]) + '" y="' + (50 + x[4] + 4) + '">' + x[0] + '</text>';
    });
    return '<svg class="pie" viewBox="0 0 100 100">' + s + t + '</svg>';
  }
  function menu(){
    return '<div class="wbs"><button class="wbs-btn" type="button">' + esc(D['選單']['按鈕']) + '</button>\n<div class="wbs-menu">' +
      D['選單']['項目'].map(function(x){ return '<a href="#' + PAGE[x[1]] + '">' + esc(x[0]) + '</a>'; }).join('') + '</div></div>';
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
    ? '<a class="tlink" href="' + esc(L['網址']) + '" target="_blank" rel="noopener" title="' + esc(L['說明']) + '">' + esc(L['文字']) + '</a>' + esc(T.slice(L['文字'].length))
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

  document.getElementById('slides').innerHTML = pages.map(function(p, k){
    return '<section class="slide" id="' + p[0] + '" data-n="' + (k + 1) + '"><div class="stage">' + p[1] + (p[0] !== PAGE.home ? menu() : '') + '</div></section>';
  }).join('');
  var cnt = document.getElementById('count'); if (cnt) cnt.textContent = '1 / ' + pages.length;
})();
