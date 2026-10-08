// Fonte única das cidades/praias. Para adicionar uma praia, basta incluir aqui.
// lat/lon são pontos no mar, próximos da praia (o modelo de ondas tem grade de alguns km,
// então praias vizinhas podem cair na mesma célula e mostrar valores parecidos).
module.exports = {
  niteroi: {
    name: 'Niterói',
    beaches: {
      camboinhas:  { name: 'Camboinhas',  lat: -22.96, lon: -43.04 },
      itaipu:      { name: 'Itaipu',      lat: -22.99, lon: -43.04 },
      itacoatiara: { name: 'Itacoatiara', lat: -23.00, lon: -43.02 },
    },
  },
};
