const $ = (id) => document.getElementById(id);
const citySel = $('city'), beachSel = $('beach'), btn = $('submit'), result = $('result');
let cities = [];
 
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};
const fmt = (n) => n.toFixed(1).replace('.', ',');
const compass = (deg) =>
  ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.round(deg / 45) % 8];
 
const waveImg = $('wave-img'), waveCaption = $('wave-caption');
const IMAGES = [
  { max: 0.5, src: '/img/05wave.gif', label: 'até 0,5 m', alt: 'Mar calmo com pequenas ondas na areia ao pôr do sol' },
  { max: 1.2, src: '/img/0512wave.gif', label: 'de 0,5 a 1,2 m', alt: 'Ondas pequenas quebrando na praia' },
  { max: 2, src: '/img/122wave.gif', label: 'de 1,2 a 2 m', alt: 'Ondas médias na beira da praia' },
  { max: Infinity, src: '/img/2wave.gif', label: 'acima de 2 m', alt: 'Surfista em uma onda grande' },
];
 
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
 
function onCityChange(savedBeach) {
  const city = cities.find((c) => c.id === citySel.value);
  fillOptions(beachSel, city.beaches, savedBeach);
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
    el('span', 'label', `altura das ondas agora · período ${Math.round(d.period)} s · vindas de ${compass(d.direction)}`)
  );
 
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
  show(box);
}
 
async function init() {
  try {
    const r = await fetch('/api/beaches');
    cities = await r.json();
    const saved = JSON.parse(localStorage.getItem('taondinha') || '{}');
    fillOptions(citySel, cities, saved.city);
    onCityChange(saved.beach);
    citySel.disabled = beachSel.disabled = btn.disabled = false;
  } catch {
    show(el('p', null, 'Não consegui carregar as praias. Recarregue a página.'), true);
  }
}
 
citySel.addEventListener('change', () => onCityChange());
 
$('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  btn.disabled = true;
  btn.textContent = 'Buscando...';
  try {
    localStorage.setItem('taondinha', JSON.stringify({ city: citySel.value, beach: beachSel.value }));
  } catch {}
  try {
    const q = new URLSearchParams({ city: citySel.value, beach: beachSel.value });
    const r = await fetch(`/api/waves?${q}`);
    const d = await r.json();
    if (!r.ok) throw new Error(d.error);
    render(d);
  } catch (err) {
    show(el('p', null, err.message || 'Algo deu errado. Tente de novo.'), true);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Procurar';
  }
});
 
init();
