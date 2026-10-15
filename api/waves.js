const CITIES = require('./_beaches');

// Índice id -> praia. Map não tem protótipo, então ids como "constructor" não passam.
const SPOTS = new Map();
for (const city of Object.values(CITIES)) {
  for (const [id, b] of Object.entries(city.beaches)) SPOTS.set(id, { ...b, city: city.name });
}

// Previsão via Open-Meteo Marine API (JSON, sem chave e sem scraping).
module.exports = async (req, res) => {
  const spot = SPOTS.get(String(req.query.beach));
  if (!spot) return res.status(400).json({ error: 'Praia inválida.' });

  const url = new URL('https://marine-api.open-meteo.com/v1/marine');
  url.search = new URLSearchParams({
    latitude: spot.lat,
    longitude: spot.lon,
    current: 'wave_height,wave_period,wave_direction',
    hourly: 'wave_height',
    daily: 'wave_height_max,wave_period_max,wave_direction_dominant',
    forecast_days: 2,
    timezone: 'America/Sao_Paulo',
  });

  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`Open-Meteo respondeu ${r.status}`);
    const d = await r.json();

    if (d.current?.wave_height == null) {
      return res.status(502).json({ error: 'Sem dados de ondas para esta praia agora.' });
    }

    const from = d.current.time.slice(0, 13) + ':00';
    const hourly = d.hourly.time
      .map((time, i) => ({ time, height: d.hourly.wave_height[i] }))
      .filter((h) => h.time >= from && h.height != null)
      .slice(0, 12);

    // Amanhã = segundo dia da série diária (máximo do dia)
    let tomorrow = null;
    if (d.daily?.wave_height_max?.[1] != null) {
      tomorrow = {
        height: d.daily.wave_height_max[1],
        period: d.daily.wave_period_max?.[1] ?? null,
        direction: d.daily.wave_direction_dominant?.[1] ?? null,
      };
    }

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=1800');
    res.status(200).json({
      beach: spot.name,
      city: spot.city,
      note: spot.note || null,
      height: d.current.wave_height,
      period: d.current.wave_period,
      direction: d.current.wave_direction,
      hourly,
      tomorrow,
    });
  } catch (err) {
    console.error(err.message);
    res.status(502).json({ error: 'Não consegui buscar a previsão. Tente de novo em instantes.' });
  }
};
