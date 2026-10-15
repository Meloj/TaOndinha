// Fonte única das cidades/praias. Para adicionar uma praia, inclua uma linha aqui.
// Os ids das praias precisam ser únicos (são usados no link: ?praia=itaipu).
// lat/lon são pontos no mar perto da praia; o modelo tem grade de alguns km,
// então praias vizinhas podem mostrar valores parecidos.
const ABRIGADA =
  'Praia abrigada (baía ou lagoa): a previsão é do mar aberto e tende a superestimar as ondas aqui.';

module.exports = {
  niteroi: {
    name: 'Niterói',
    beaches: {
      camboinhas:  { name: 'Camboinhas',  lat: -22.96, lon: -43.04 },
      itaipu:      { name: 'Itaipu',      lat: -22.99, lon: -43.04 },
      itacoatiara: { name: 'Itacoatiara', lat: -23.00, lon: -43.02 },
      sossego:     { name: 'Sossego',     lat: -22.99, lon: -43.03 },
      piratininga: { name: 'Piratininga', lat: -22.97, lon: -43.09, note: ABRIGADA },
      icarai:      { name: 'Icaraí',      lat: -22.91, lon: -43.11, note: ABRIGADA },
    },
  },
  rio: {
    name: 'Rio de Janeiro',
    beaches: {
      flamengo:        { name: 'Flamengo',        lat: -22.935, lon: -43.165, note: ABRIGADA },
      copacabana:      { name: 'Copacabana',      lat: -22.99,  lon: -43.18 },
      ipanema:         { name: 'Ipanema',         lat: -23.00,  lon: -43.20 },
      leblon:          { name: 'Leblon',          lat: -23.00,  lon: -43.22 },
      'sao-conrado':   { name: 'São Conrado',     lat: -23.03,  lon: -43.28 },
      'barra-da-tijuca': { name: 'Barra da Tijuca', lat: -23.04, lon: -43.37 },
      recreio:         { name: 'Recreio',         lat: -23.06,  lon: -43.46 },
      grumari:         { name: 'Grumari',         lat: -23.07,  lon: -43.52 },
    },
  },
  marica: {
    name: 'Maricá',
    beaches: {
      itaipuacu: { name: 'Itaipuaçu', lat: -22.99, lon: -42.97 },
    },
  },
};
