const CITIES = require('./_beaches');

module.exports = (req, res) => {
  const list = Object.entries(CITIES).map(([id, c]) => ({
    id,
    name: c.name,
    beaches: Object.entries(c.beaches).map(([bid, b]) => ({ id: bid, name: b.name })),
  }));
  res.setHeader('Cache-Control', 's-maxage=86400');
  res.status(200).json(list);
};
