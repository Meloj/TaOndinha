const extract = () => {

const form = document.querySelector('form');

const selectedCity = document.querySelector('select.options-city').value;
console.log(selectedCity);
const selectedBeach = document.querySelector('select.options-beach').value;
console.log(selectedBeach);


return selectedBeach;
}

module.exports = extract;


