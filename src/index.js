import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countriesList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
document.querySelector('#search-box').placeholder = 'Search for any country...';

searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));
function onInputSearch(e) {
  const value = searchBox.value.trim();
  console.log(value);

  if (!value) {
    addHidden();
    clearInterfaceUI();
    return;
  }

  fetchCountries(value)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      renderCountries(data);
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      return error;
      
    });
  e.preventDefault();
}

const generateMarkupInfo = data =>
  data.reduce(
    (acc, { flags: { svg }, name, capital, population, languages }) => {
      console.log(languages);
      languages = Object.values(languages).join(', ');
      console.log(name);
      return (
        acc +
        ` <ul>
                <li>
                    <img src="${svg}" alt="${name}" width="25" height="auto">
                    <span> </span>
                    <b>${name.official}</b>
                </li>
                <li><b>Capital</b>: <span> ${capital}</span></li>
                <li><b>Population</b>: <span> ${population}</span></li>
                <li><b>Languages</b>: <span> ${languages}</span></li>
            </ul>`
      );
    },
    ''
  );

const generateMarkupList = data =>
  data.reduce((acc, { name: { official, common }, flags: { svg } }) => {
    return (
      acc +
      `<li>
        <img src="${svg}" alt="${common}" width="50">
        <span>${official}</span>
      </li>`
    );
  }, '');

function renderCountries(result) {
  if (result.length === 1) {
    countriesList.innerHTML = '';
    countriesList.style.visibility = 'hidden';
    countryInfo.style.visibility = 'visible';
    countryInfo.innerHTML = generateMarkupInfo(result);
  }
  if (result.length >= 2 && result.length <= 10) {
    countryInfo.innerHTML = '';
    countryInfo.style.visibility = 'hidden';
    countriesList.style.visibility = 'visible';
    countriesList.innerHTML = generateMarkupList(result);
  }
}

function clearInterfaceUI() {
  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function addHidden() {
  countriesList.style.visibility = 'hidden';
  countryInfo.style.visibility = 'hidden';
}
