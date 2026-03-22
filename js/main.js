/* ══════════════════════════════════════
   MONTAGNA TAKAO FC — Main JS
   データファイル（data/*.js）を読み込んで表示
   ══════════════════════════════════════ */

// ── Data stores ──
var articles = [];
var matches = [];
var players = [];
var staticPages = {};

// ── Constants ──
var CAT_ICONS = { '試合情報': '⚽', 'レポート': '📋', 'お知らせ': '📢', 'チーム': '👤' };

// ── State ──
var currentSection = 'home';

// ══════════════════════════════════════
// Data Loading（data/*.js のグローバル変数から変換）
// ══════════════════════════════════════
function loadAllData() {
  // News
  articles = (typeof NEWS_DATA !== 'undefined' ? NEWS_DATA : []).map(function(r) {
    return {
      id: r.id,
      title: r.title,
      cat: r.category,
      emoji: CAT_ICONS[r.category] || '📰',
      imgData: r.image || '',
      summary: r.summary || '',
      url: r.url || '',
      date: r.date,
      ts: new Date(r.date.replace(/\./g, '-')).getTime()
    };
  });

  // Matches
  matches = (typeof MATCHES_DATA !== 'undefined' ? MATCHES_DATA : []).map(function(r) {
    return {
      id: r.id,
      date: r.date,
      time: r.time,
      ha: r.home_away,
      type: r.type,
      opp: r.opponent,
      venue: r.venue,
      scoreHome: r.score_home != null ? r.score_home : null,
      scoreAway: r.score_away != null ? r.score_away : null
    };
  });

  // Players
  players = (typeof TEAM_DATA !== 'undefined' ? TEAM_DATA : []).map(function(r) {
    return {
      id: r.id,
      name: r.name,
      nameEn: r.name_en || '',
      number: r.number,
      pos: r.position,
      from: r.birthplace,
      bio: r.bio || ''
    };
  });

  // Static pages
  staticPages = typeof PAGES_DATA !== 'undefined' ? PAGES_DATA : {};
}

// ══════════════════════════════════════
// Rendering
// ══════════════════════════════════════
function escapeHTML(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function getCatClass(cat) {
  return { '試合情報': 'match', 'レポート': 'report', 'お知らせ': 'info' }[cat] || '';
}

function renderNewsCard(a) {
  var imgHtml = a.imgData ? '<img src="' + escapeHTML(a.imgData) + '" alt="">' : '';
  var emojiHtml = a.imgData ? '' : '<span class="news-img-emoji">' + (a.emoji || '📰') + '</span>';
  var excerpt = escapeHTML(a.summary.slice(0, 60) + (a.summary.length > 60 ? '…' : ''));
  var linkTag = a.url ? '<a class="news-card" href="' + escapeHTML(a.url) + '">' : '<div class="news-card">';
  var closeTag = a.url ? '</a>' : '</div>';
  return linkTag
    + '<div class="news-img-wrap">' + imgHtml + emojiHtml + '</div>'
    + '<div class="news-body"><span class="news-cat ' + getCatClass(a.cat) + '">' + escapeHTML(a.cat) + '</span>'
    + '<div class="news-title">' + escapeHTML(a.title) + '</div>'
    + '<div class="news-excerpt">' + excerpt + '</div>'
    + '<div class="news-date">' + escapeHTML(a.date) + '</div></div>'
    + closeTag;
}

function renderMatchCard(m) {
  var d = new Date(m.date);
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  var dows = ['日', '月', '火', '水', '木', '金', '土'];
  var dow = dows[d.getDay()];
  var score = (m.scoreHome !== null && m.scoreAway !== null)
    ? (m.scoreHome + ' - ' + m.scoreAway)
    : (m.time + ' KO');
  var haBadge = '<span class="match-ha-badge ' + (m.ha === 'HOME' ? 'match-ha-home' : 'match-ha-away') + '">' + (m.ha === 'HOME' ? 'HOME' : 'AWAY') + '</span>';
  var myName = m.ha === 'HOME' ? '<strong>モンターニャ高尾</strong>' : 'モンターニャ高尾';
  var oppName = m.ha === 'AWAY' ? '<strong>' + escapeHTML(m.opp) + '</strong>' : escapeHTML(m.opp);

  return '<div class="match-card">' + haBadge
    + '<div class="match-type">' + escapeHTML(m.type) + '</div>'
    + '<div class="match-date">' + mon + '/' + day + '</div>'
    + '<div class="match-date-sub">(' + dow + ') ' + escapeHTML(m.time) + '</div>'
    + '<div class="match-teams">'
    + '<div class="match-team"><div class="match-team-name">' + myName + '</div></div>'
    + '<div class="match-score-area"><div class="match-score">' + score + '</div></div>'
    + '<div class="match-team away"><div class="match-team-name">' + oppName + '</div></div>'
    + '</div>'
    + '<div class="match-venue">📍 ' + escapeHTML(m.venue) + '</div></div>';
}

function renderPlayerCard(p) {
  return '<a class="player-card" href="player.html?id=' + p.id + '">'
    + '<div class="player-num">#' + p.number + '</div>'
    + '<div class="player-pos">' + escapeHTML(p.pos) + '</div>'
    + '<div class="player-name-ja">' + escapeHTML(p.name) + '</div>'
    + (p.nameEn ? '<div class="player-name-en">' + escapeHTML(p.nameEn) + '</div>' : '')
    + '<div class="player-from">📍 ' + escapeHTML(p.from) + '</div>'
    + '<div class="player-bio-text">' + escapeHTML(p.bio) + '</div></a>';
}

function renderSocial() {
  var social = typeof SOCIAL_DATA !== 'undefined' ? SOCIAL_DATA : {};

  // YouTube
  if (social.youtube_url) {
    var videoId = social.youtube_url;
    var match = social.youtube_url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    if (match) videoId = match[1];
    var embed = document.getElementById('yt-embed-area');
    if (embed) {
      embed.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '" allowfullscreen style="width:100%;height:100%;border:none;"></iframe>';
    }
  }

  // Instagram
  var igLink = document.getElementById('ig-link');
  if (igLink && social.instagram_url) {
    igLink.href = social.instagram_url;
  }
  if (social.instagram_posts && social.instagram_posts.length > 0) {
    var grid = document.getElementById('ig-grid');
    if (grid) {
      grid.innerHTML = social.instagram_posts.map(function(postUrl) {
        // 投稿URLの末尾にスラッシュを付与
        var url = postUrl.replace(/\/$/, '') + '/';
        return '<div class="ig-post">'
          + '<iframe src="' + url + 'embed/" frameborder="0" scrolling="no" allowtransparency="true" style="width:100%;min-height:400px;border:none;"></iframe>'
          + '</div>';
      }).join('');
    }
  }
}

function renderAll() {
  var sorted = [].concat(articles).sort(function(a, b) { return b.ts - a.ts; });

  // Home news (top 3)
  var hg = document.getElementById('news-grid-home');
  if (hg) hg.innerHTML = sorted.slice(0, 3).map(renderNewsCard).join('');

  // Full news
  var fg = document.getElementById('news-grid-full');
  if (fg) fg.innerHTML = sorted.map(renderNewsCard).join('');

  // Matches
  var ms = [].concat(matches).sort(function(a, b) { return new Date(a.date) - new Date(b.date); });
  var mh = document.getElementById('match-cards-home');
  if (mh) mh.innerHTML = ms.slice(0, 4).map(renderMatchCard).join('');
  var mf = document.getElementById('match-cards-full');
  if (mf) { mf.innerHTML = ms.map(renderMatchCard).join(''); animateCards(mf); }

  // Players
  var pg = document.getElementById('players-grid');
  if (pg) {
    var sortedPlayers = [].concat(players).sort(function(a, b) { return a.number - b.number; });
    pg.innerHTML = sortedPlayers.map(renderPlayerCard).join('');
    animateCards(pg);
  }

  // Social
  renderSocial();
}

function animateCards(container) {
  var cards = container.children;
  for (var i = 0; i < cards.length; i++) {
    (function(card, delay) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(function() {
        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, delay);
    })(cards[i], i * 80);
  }
}

// ══════════════════════════════════════
// Section Navigation (SPA)
// ══════════════════════════════════════
function showSection(s) {
  currentSection = s;
  ['home', 'news', 'match', 'team', 'static'].forEach(function(x) {
    var el = document.getElementById('section-' + x);
    if (el) el.style.display = x === s ? 'block' : 'none';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (s === 'match') {
    var mf = document.getElementById('match-cards-full');
    if (mf) animateCards(mf);
  }
  if (s === 'team') {
    var pg = document.getElementById('players-grid');
    if (pg) animateCards(pg);
  }
}

function goBackFromStatic() { showSection(currentSection || 'home'); }

// ══════════════════════════════════════
// Static Pages
// ══════════════════════════════════════
function openStaticPage(key) {
  var page = staticPages[key] || { title: '準備中', content: 'このページは現在準備中です。' };
  var content = escapeHTML(page.content).replace(/\n/g, '<br>');
  document.getElementById('static-content').innerHTML = '<h2>' + escapeHTML(page.title) + '</h2><div style="margin-top:16px"><p>' + content + '</p></div>';
  showSection('static');
}

// ══════════════════════════════════════
// News Filter
// ══════════════════════════════════════
function filterNews(cat) {
  document.querySelectorAll('.cat-filter-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  var sorted = [].concat(articles).sort(function(a, b) { return b.ts - a.ts; });
  var filtered = cat === 'all' ? sorted : sorted.filter(function(a) { return a.cat === cat; });
  document.getElementById('news-grid-full').innerHTML = filtered.map(renderNewsCard).join('');
}

// ══════════════════════════════════════
// Mega Menu
// ══════════════════════════════════════
function toggleMegaMenu() {
  document.getElementById('megaMenu').classList.toggle('open');
}
function closeMegaMenu() {
  document.getElementById('megaMenu').classList.remove('open');
}
document.addEventListener('click', function(e) {
  if (!document.getElementById('megaMenu').contains(e.target) && !e.target.closest('.menu-tab-btn')) {
    closeMegaMenu();
  }
});

// ══════════════════════════════════════
// Toast
// ══════════════════════════════════════
var _toastTimer;
function showToast(msg) {
  clearTimeout(_toastTimer);
  var t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  _toastTimer = setTimeout(function() { t.classList.remove('show'); }, 2800);
}

// ══════════════════════════════════════
// Init
// ══════════════════════════════════════
loadAllData();
renderAll();
showSection('home');
