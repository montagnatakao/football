/* ══════════════════════════════════════
   MONTAGNA TAKAO FC — Player Detail JS
   data/players.js のデータを表示
   ══════════════════════════════════════ */

// ── Position label map ──
var posMap = {
  GK: 'GOALKEEPER',
  DF: 'DEFENDER',
  MF: 'MIDFIELDER',
  FW: 'FORWARD'
};

// ── Get player ID from URL ──
function getPlayerId() {
  var params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'));
}

// ── Load and render player ──
function loadPlayer() {
  var playerId = getPlayerId();
  if (!playerId) {
    document.getElementById('name-kanji').textContent = '選手が見つかりません';
    return;
  }

  var playersList = typeof PLAYERS_DATA !== 'undefined' ? PLAYERS_DATA : [];
  var p = playersList.find(function(x) { return x.id === playerId; });

  if (!p) {
    document.getElementById('name-kanji').textContent = '選手が見つかりません';
    return;
  }

  // Name
  document.getElementById('name-kanji').textContent = p.name || '';
  document.getElementById('name-roman').textContent = p.name_en || '';

  // Position & Number
  document.getElementById('stat-position').textContent = p.position + ' — ' + (posMap[p.position] || p.position);
  document.getElementById('stat-number').textContent = p.number || '';
  document.getElementById('display-number').textContent = p.number || '';
  document.getElementById('bg-number').textContent = p.number || '';
  document.getElementById('display-pos').textContent = posMap[p.position] || p.position;

  // Stats
  document.getElementById('stat-dob').textContent = p.birthday || '';
  document.getElementById('stat-birthplace').textContent = p.birthplace || '';
  document.getElementById('stat-height').textContent = p.height ? p.height + ' cm' : '';
  document.getElementById('stat-weight').textContent = p.weight ? p.weight + ' kg' : '';

  // Features
  document.getElementById('feature-text').textContent = p.features || '';

  // Photo
  if (p.image) {
    var img = document.getElementById('player-photo');
    var placeholder = document.getElementById('photo-placeholder');
    img.src = p.image;
    img.style.display = 'block';
    placeholder.style.display = 'none';
  }

  // Page title
  document.title = (p.name || '選手') + ' | MONTAGNA TAKAO FC';
}

// ── Share functions ──
function getPlayerName() {
  return document.getElementById('name-kanji').textContent.trim() ||
         document.getElementById('name-roman').textContent.trim() || '選手';
}

function getPlayerNumber() {
  return document.getElementById('display-number').textContent.trim() || '';
}

function getPlayerPos() {
  var posText = document.getElementById('stat-position').textContent.trim();
  return posText.split(' ')[0] || '';
}

function shareX() {
  var name = getPlayerName();
  var num = getPlayerNumber();
  var pos = getPlayerPos();
  var text = '【選手紹介】#' + num + ' ' + name + ' (' + pos + ')\n#モンターニャ高尾 #MONTAGNATAKAOFC';
  window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text), '_blank', 'noopener,width=560,height=520');
}

function shareInstagram() {
  var name = getPlayerName();
  var num = getPlayerNumber();
  var pos = getPlayerPos();
  var feat = document.getElementById('feature-text').textContent.trim();
  var text = '【選手紹介】\n#' + num + ' ' + name + ' (' + pos + ')' + (feat ? '\n\n' + feat : '') + '\n\n#モンターニャ高尾 #MONTAGNATAKAOFC\n' + location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() { showToast('📋 キャプションをコピー → Instagramに貼り付けてください'); });
  } else {
    showToast('📋 コピーに失敗しました');
  }
}

function shareLine() {
  var name = getPlayerName();
  var num = getPlayerNumber();
  var pos = getPlayerPos();
  var text = '【選手紹介】#' + num + ' ' + name + ' (' + pos + ')\n#モンターニャ高尾';
  window.open('https://social-plugins.line.me/lineit/share?url=' + encodeURIComponent(location.href) + '&text=' + encodeURIComponent(text), '_blank', 'noopener,width=560,height=520');
}

function copyLink() {
  var url = location.href;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(function() { showToast('🔗 URLをコピーしました'); });
  } else {
    showToast('🔗 コピーに失敗しました');
  }
}

// ── Toast ──
var _tt;
function showToast(msg) {
  clearTimeout(_tt);
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  _tt = setTimeout(function() { t.classList.remove('show'); }, 2500);
}

// ── Init ──
loadPlayer();
