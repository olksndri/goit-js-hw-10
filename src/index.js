import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const DEBOUNCE_DELAY = 300;

const dataHandler = data => {
  const list = document.querySelector('.country-list');
  const infoDiv = document.querySelector('.country-info');
  let listCounter = '';
  let infoCounter = '';
  if (data.length > 10) {
    manyCountries();
  } else if (data.length >= 2 && data.length <= 10) {
    fewCountries(data, listCounter, list);
  } else {
    oneCountry(data, listCounter, infoCounter, list, infoDiv);
  }
};
const manyCountries = () => {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
};
const fewCountries = (data, listCounter, list) => {
  data.forEach(({ flags: { svg }, name: { official } }) => {
    listCounter += `<li><img src="${svg}"><p>${official}</p></li>`;
  });
  list.innerHTML = listCounter;
};
const oneCountry = (data, listCounter, infoCounter, list, infoDiv) => {
  data.forEach(
    ({
      flags: { svg },
      name: { official },
      capital,
      population,
      languages,
    }) => {
      let langs = Object.values(languages).join(', ');
      listCounter += `<li><img src="${svg}"><p>${official}</p></li>`;
      infoCounter += `<p>Capital: ${capital}</p><p>Population: ${population}</p><p>Languages: ${langs}</p>`;
    }
  );
  list.innerHTML = listCounter;
  infoDiv.innerHTML = infoCounter;
};

input.addEventListener(
  'input',
  debounce(() => {
    document.querySelector('.country-list').innerHTML = '';
    document.querySelector('.country-info').innerHTML = '';
    if (input.value.trim() !== '') {
      fetchCountries(input.value.trim())
        .then(data => {
          dataHandler(data);
        })
        .catch(error => {
          if (Number(error.message) === 404) {
            Notiflix.Notify.failure('Oops, there is no country with that name');
          }
        });
    }
  }, DEBOUNCE_DELAY)
);
