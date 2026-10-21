'use strict';
const characters = window.CHARACTERS;
if (new Set(characters.map(c=>c.id)).size !== characters.length) console.error('Duplicate character ID');
const chapters = window.CHAPTERS;
const main = document.querySelector('#main');
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const ranked = () => [...characters].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'ja'));
const avatar = (c, extra = '') => `<div class="avatar ${extra}" style="--character-color:${c.color}"><span class="avatar-orbit"></span><span class="avatar-icon" aria-hidden="true">${escapeHTML(c.icon)}</span><span class="avatar-element">${escapeHTML(c.element)}</span></div>`;
const card = c => `<a class="character-card" href="#character/${c.id}">${avatar(c)}<div class="character-body"><span class="stars" aria-label="レアリティ${c.rarity}">${'★'.repeat(c.rarity)}</span><h3>${escapeHTML(c.name)}</h3><p>${escapeHTML(c.role)}</p><div class="card-bottom"><span class="element" style="--character-color:${c.color}">${escapeHTML(c.element)}属性</span><span class="score">${c.score.toFixed(1)}<small> / 10</small></span></div></div></a>`;
const sectionHeading = (en, title, link = '', label = 'すべて見る') => `<div class="section-heading"><div><span class="eyebrow">${en}</span><h2>${title}</h2></div>${link ? `<a class="text-link" href="${link}">${label} <span>↗</span></a>` : ''}</div>`;
const chapterCard = c => `<a class="chapter-card" href="#guide/${c.id}" style="--chapter-color:${c.color}"><div class="chapter-art" aria-hidden="true"><span class="chapter-number">${c.label.slice(-2)}</span><span class="chapter-emblem">${c.icon}</span></div><div class="chapter-content"><span class="chapter-label">${c.label} <span>${c.difficulty}</span></span><h3>${c.name}</h3><p>${c.subtitle}</p><span class="text-link">攻略を読む ↗</span></div></a>`;
function shell(title, subtitle, content, en = 'EISHO STORY GUIDE') {
  return `<div class="container page"><a class="breadcrumb" href="#home">トップ /</a><header class="page-heading"><span class="eyebrow">${en}</span><h1>${title}</h1><p>${subtitle}</p></header>${content}</div>`;
}
function home() {
  main.innerHTML = `<section class="hero"><div class="container hero-inner"><div class="hero-copy"><span class="hero-label"><span></span> YOUR NEXT ADVENTURE STARTS HERE</span><h1>その一手が、<br>物語を<span>変える。</span></h1><p>仲間を知り、最強のチームをつくろう。<br>「吉野瑛翔物語」のキャラ評価・攻略ガイド。</p><div class="hero-actions"><a class="button button-yellow" href="#characters">キャラ図鑑を見る <span>→</span></a><a class="hero-secondary" href="#guides">ストーリー攻略 ↗</a></div><span class="hero-note">全${characters.length}キャラ収録 <i></i> 3つのストーリー</span></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-spark spark-one">✧</span><span class="art-spark spark-two">✦</span><div class="hero-tile tile-green">⬡</div><div class="hero-tile tile-blue">◈</div><div class="hero-tile tile-purple">☾</div><div class="hero-main-badge"><span class="badge-stars">★ ★ ★ ★ ★ ★</span><span class="badge-symbol">✦</span><span class="badge-name">吉野瑛翔</span><span class="badge-caption">THE STORY BEGINS</span></div><span class="art-caption">EVERY HERO HAS A STORY.</span></div></div></section>
  <div class="container"><div class="notice"><span>GUIDE NOTE</span>掲載中の能力・評価・攻略は、オリジナル企画の仮データです。</div><section class="home-section">${sectionHeading('CHARACTER PICKUP', '冒険を彩る、仲間たち。', '#characters', 'キャラ図鑑へ')}<div class="character-grid">${[characters[0], characters[1], characters[3], characters[5]].map(card).join('')}</div></section>
  <section class="home-section two-columns"><div class="ranking-panel">${sectionHeading('POWER RANKING', '最強キャラランキング', '#ranking', '一覧へ')}<p class="section-description">総合評価で選ぶ、注目のトップ3。</p><div class="ranking-list">${ranked().slice(0,3).map((c,i)=>rankingRow(c,i)).join('')}</div><p class="data-note">※ 仮の総合評価点に基づくランキング</p></div><a class="beginner-panel" href="#guides"><span class="eyebrow">FIRST STEP</span><span class="beginner-art" aria-hidden="true">⚑</span><h2>はじめての冒険も、<br>ここから。</h2><p>各ステージのギミックやおすすめ編成を<br>チェックして、攻略の一歩を踏み出そう。</p><span class="button button-dark">攻略ガイドを見る <span>→</span></span></a></section>
  <section class="home-section">${sectionHeading('STORY WALKTHROUGH', '物語を進めよう。', '#guides', '攻略一覧へ')}<div class="chapter-grid">${chapters.map(chapterCard).join('')}</div></section><div class="bottom-callout"><span>✦</span><div><strong>あなただけの最強チームを見つけよう。</strong><p>属性も、個性も、組み合わせ次第。</p></div><a class="text-link" href="#characters">全キャラをチェック →</a></div></div>`;
}
function rankingRow(c, i) { return `<a class="ranking-row" href="#character/${c.id}"><span class="rank rank-${i+1}">${String(i+1).padStart(2,'0')}</span>${avatar(c,'mini')}<div class="ranking-name"><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.element)}属性 / ${escapeHTML(c.role)}</small></div><span class="score">${c.score.toFixed(1)}<small> / 10</small></span><span class="row-arrow">↗</span></a>`; }
function catalog() {
  main.innerHTML = shell('キャラ図鑑', 'お気に入りの仲間を見つけて、能力や評価をチェック。', `<div class="catalog-controls"><label class="search-label" for="character-search">名前で検索<input id="character-search" type="search" placeholder="キャラ名・よみがなを入力" autocomplete="off"></label><label for="element-filter">属性<select id="element-filter"><option value="">すべての属性</option>${['火','水','木','光','闇'].map(e=>`<option value="${e}">${e}属性</option>`).join('')}</select></label><label for="group-filter">所属編<select id="group-filter"><option value="">すべての編</option>${["芳野中学校編","高岡高校編","横浜国立大学編","その他"].map(g=>`<option value="${g}">${g}</option>`).join("")}</select></label><label for="sort-order">並び順<select id="sort-order"><option value="default">図鑑順</option><option value="score">評価が高い順</option><option value="name">名前順</option><option value="rarity">レアリティ順</option></select></label></div><p id="result-count" class="result-count" role="status" aria-live="polite"></p><div id="character-results" class="character-grid"></div>`, 'CHARACTER DATABASE');
  const update = () => {
    const normalize = s => s.normalize('NFKC').toLowerCase().replace(/[\u30a1-\u30f6]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s/g,'');
    const query = normalize(document.querySelector('#character-search').value);
    const element = document.querySelector('#element-filter').value;
    const order = document.querySelector('#sort-order').value;
    const group = document.querySelector('#group-filter').value;
    const result = characters.filter(c => normalize(c.name+c.reading).includes(query) && (!element || c.element === element) && (!group || c.group === group));
    if (order === 'score') result.sort((a,b)=>b.score-a.score);
    if (order === 'rarity') result.sort((a,b)=>b.rarity-a.rarity || b.score-a.score);
    if (order === 'name') result.sort((a,b)=>a.reading.localeCompare(b.reading,'ja'));
    document.querySelector('#result-count').textContent = `${result.length} / ${characters.length} キャラ`;
    document.querySelector('#character-results').innerHTML = result.length ? result.map(card).join('') : '<div class="empty-state"><span>⌕</span><h2>キャラが見つかりませんでした</h2><p>名前や属性を変えて検索してみてください。</p></div>';
  };
  document.querySelector('#character-search').addEventListener('input',update);
  document.querySelector('#element-filter').addEventListener('change',update);
  document.querySelector('#group-filter').addEventListener('change',update);
  document.querySelector('#sort-order').addEventListener('change',update);
  update();
}
function detail(id) {
  const c = characters.find(c=>c.id === id);
  if (!c) return notFound();
  main.innerHTML = shell(escapeHTML(c.name), escapeHTML(c.title), `<a class="text-link back-link" href="#characters">← キャラ図鑑に戻る</a><div class="detail-hero">${avatar(c,'large')}<div><span class="stars">${'★'.repeat(c.rarity)}</span><h2>${escapeHTML(c.name)}</h2><p>${escapeHTML(c.element)}属性 / ${escapeHTML(c.role)}</p><div class="detail-rating">総合評価 <span class="score">${c.score.toFixed(1)}<small> / 10</small></span><span class="placeholder-tag">仮データ</span></div><p>${escapeHTML(c.description)}</p></div></div><div class="stats-grid">${[['HP',c.hp],['攻撃力',c.attack],['スピード',c.speed]].map(([label,value])=>`<div><span>${label}</span><strong>${value.toLocaleString('ja-JP')}</strong></div>`).join('')}</div><div class="detail-grid"><section class="info-panel"><h2>能力・スキル</h2><h3>アビリティ</h3><p>${escapeHTML(c.ability)}</p><h3>友情コンボ</h3><p><strong>${escapeHTML(c.friendshipCombo || "未設定")}</strong></p><p>${escapeHTML(c.friendshipEffect || "")}</p><h3>ストライクショット（SS）</h3><p><strong>${escapeHTML(c.strikeShot || c.skill)}</strong></p><p>${escapeHTML(c.strikeEffect || "")}</p></section><section class="info-panel"><h2>評価・使い方</h2><h3>強いところ</h3><ul>${c.strengths.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul><h3>編成のポイント</h3><p>${escapeHTML(c.caution)}</p></section></div><section class="home-section">${sectionHeading('RECOMMENDED STAGE','おすすめの攻略ページ')}<div class="chapter-grid">${chapters.filter(ch=>ch.name === c.chapter).map(chapterCard).join('')}</div></section>`, 'CHARACTER DETAILS');
}
function ranking() {
  main.innerHTML = shell('最強キャラランキング', '全キャラを総合評価点の高い順にチェック。', `<div class="notice"><span>RANKING GUIDE</span>仮データの総合評価点順です。同点は同順位として表示します。編成やステージとの相性も参考にしてください。</div><div class="full-ranking">${ranked().map((c,i,all)=>rankingRow(c,all.findIndex(x=>x.score === c.score))).join('')}</div>`, 'POWER RANKING');
}
function guides() { main.innerHTML = shell('ストーリー攻略', '3つの舞台を巡り、仲間とともに次のステージへ。', `<div class="chapter-grid">${chapters.map(chapterCard).join('')}</div><div class="notice"><span>PLAY GUIDE</span>ステージやギミックは創作用の仮設定です。まずは初級の芳野中学校編から。</div>`, 'STORY WALKTHROUGH'); }
function guide(id) {
  const c = chapters.find(c=>c.id === id);
  if (!c) return notFound();
  main.innerHTML = shell(c.name,c.subtitle,`<a class="text-link back-link" href="#guides">← 攻略一覧に戻る</a><div class="guide-summary" style="--chapter-color:${c.color}"><span class="guide-icon" aria-hidden="true">${c.icon}</span><div><span class="eyebrow">${c.label} / ${c.difficulty}</span><h2>攻略のカギを押さえよう。</h2><p>主なギミック：${c.gimmick}</p></div><span class="placeholder-tag">仮設定</span></div><section class="home-section">${sectionHeading('BATTLE STRATEGY','攻略の流れ')}<ol class="strategy-list">${c.steps.map((s,i)=>`<li><span>0${i+1}</span><p>${s}</p></li>`).join('')}</ol><div class="notice"><span>ONE POINT</span>${c.tip}</div></section><section class="home-section">${sectionHeading('RECOMMENDED TEAM','おすすめ編成')}<p class="section-description">キャラを選ぶと能力・評価を確認できます。</p><div class="character-grid">${c.team.map(id=>card(characters.find(c=>c.id === id))).join('')}</div></section>`, 'STORY WALKTHROUGH');
}
function notFound() { main.innerHTML = shell('ページが見つかりません', 'リンク先を確認するか、トップページから探してください。','<a class="button button-dark" href="#home">トップに戻る →</a>'); }
function render() {
  const route = location.hash.slice(1) || 'home';
  const [page,id] = route.split('/');
  if(page === 'home') home(); else if(page === 'characters') catalog(); else if(page === 'character') detail(id); else if(page === 'ranking') ranking(); else if(page === 'guides') guides(); else if(page === 'guide') guide(id); else notFound();
  const active = page === 'character' ? 'characters' : page === 'guide' ? 'guides' : page;
  document.querySelectorAll('[data-nav]').forEach(a=> { if (a.dataset.nav === active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
  document.title = `${page === 'home' ? 'キャラ評価・攻略ガイド' : main.querySelector('h1').textContent} | 吉野瑛翔物語`;
  window.scrollTo(0,0);
  if (document.activeElement !== document.body) main.focus({preventScroll:true});
}
window.addEventListener('hashchange',render);
render();
