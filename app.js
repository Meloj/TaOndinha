const $ = (id) => document.getElementById(id);
const citySel = $('city'), beachSel = $('beach'), result = $('result');
const waveImg = $('wave-img'), waveCaption = $('wave-caption');
let cities = [], reqId = 0;

const IMAGES = [
  { max: 0.5, src: '/img/05wave.gif', label: 'até 0,5 m', alt: 'Mar calmo com pequenas ondas na areia ao pôr do sol' },
  { max: 1.2, src: '/img/0512wave.gif', label: 'de 0,5 a 1,2 m', alt: 'Ondas pequenas quebrando na praia' },
  { max: 2, src: '/img/122wave.gif', label: 'de 1,2 a 2 m', alt: 'Ondas médias na beira da praia' },
  { max: Infinity, src: '/img/2wave.gif', label: 'acima de 2 m', alt: 'Surfista em uma onda grande' },
];

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const fmt = (n) => n.toFixed(1).replace('.', ',');
const compass = (deg) => ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(deg / 45) % 8];
const details = (period, dir) =>
  [period != null && `período ${Math.round(period)} s`, dir != null && `vindas de ${compass(dir)}`]
    .filter(Boolean).join(' · ');

function setImage(height) {
  const pick = IMAGES.find((i) => height <= i.max);
  if (waveImg.getAttribute('src') === pick.src) return;
  const next = new Image();
  next.onload = () => {
    waveImg.style.opacity = 0;
    setTimeout(() => {
      waveImg.src = pick.src;
      waveImg.alt = pick.alt;
      waveCaption.textContent = `Ilustração: ondas ${pick.label}`;
      waveCaption.hidden = false;
      waveImg.style.opacity = 1;
    }, 250);
  };
  next.src = pick.src;
}

function fillOptions(select, items, selected) {
  select.replaceChildren(...items.map((i) => {
    const o = el('option', null, i.name);
    o.value = i.id;
    return o;
  }));
  if (selected && items.some((i) => i.id === selected)) select.value = selected;
}

function show(node, isError = false) {
  result.replaceChildren(node);
  result.classList.toggle('error', isError);
  result.hidden = false;
}

function render(d) {
  setImage(d.height);
  const box = el('div');
  box.append(
    el('span', 'place', `${d.beach}, ${d.city}`),
    el('span', 'height', `${fmt(d.height)} m`),
    el('span', 'label', ['agora', details(d.period, d.direction)].filter(Boolean).join(' · '))
  );
  if (d.note) box.append(el('span', 'note', d.note));

  if (d.hourly.length) {
    const max = Math.max(...d.hourly.map((h) => h.height), 0.1);
    const chart = el('div', 'hours');
    d.hourly.forEach((h) => {
      const col = el('div', 'hour');
      const bar = el('div', 'bar');
      bar.style.height = `${Math.max((h.height / max) * 100, 4)}%`;
      bar.title = `${fmt(h.height)} m`;
      col.append(bar, el('small', null, `${h.time.slice(11, 13)}h`));
      chart.append(col);
    });
    box.append(el('span', 'label', 'próximas horas'), chart);
  }

  if (d.tomorrow) {
    const t = d.tomorrow;
    box.append(el('p', 'tomorrow', `Amanhã: ondas de até ${fmt(t.height)} m` +
      (details(t.period, t.direction) ? ` · ${details(t.period, t.direction)}` : '')));
  }

  const share = el('button', 'share', 'Compartilhar');
  share.type = 'button';
  share.addEventListener('click', async () => {
    const text = `Ondas em ${d.beach}: ${fmt(d.height)} m agora. TáOndinha?`;
    try {
      if (navigator.share) await navigator.share({ title: 'TáOndinha?', text, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        share.textContent = 'Link copiado!';
      }
    } catch {}
  });
  box.append(share);
  show(box);
}

async function search() {
  const id = ++reqId;
  const beach = beachSel.value;
  const url = new URL(location.href);
  url.searchParams.set('praia', beach);
  history.replaceState(null, '', url);
  try { localStorage.setItem('taondinha', beach); } catch {}

  show(el('p', null, 'Buscando as ondas...'));
  try {
    const r = await fetch(`/api/waves?beach=${encodeURIComponent(beach)}`);
    const d = await r.json();
    if (id !== reqId) return; // uma busca mais nova já foi feita
    if (!r.ok) throw new Error(d.error);
    render(d);
  } catch (err) {
    if (id === reqId) show(el('p', null, err.message || 'Algo deu errado. Tente de novo.'), true);
  }
}

async function init() {
  try {
    const r = await fetch('/api/beaches');
    cities = await r.json();
  } catch {
    return show(el('p', null, 'Não consegui carregar as praias. Recarregue a página.'), true);
  }
  let wanted = new URLSearchParams(location.search).get('praia');
  if (!wanted) { try { wanted = localStorage.getItem('taondinha'); } catch {} }
  const city = cities.find((c) => c.beaches.some((b) => b.id === wanted)) || cities[0];

  fillOptions(citySel, cities, city.id);
  fillOptions(beachSel, city.beaches, wanted);
  citySel.disabled = beachSel.disabled = false;
  search();
}

citySel.addEventListener('change', () => {
  fillOptions(beachSel, cities.find((c) => c.id === citySel.value).beaches);
  search();
});
beachSel.addEventListener('change', search);
$('form').addEventListener('submit', (e) => e.preventDefault());

init();
