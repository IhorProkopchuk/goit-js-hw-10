import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputEl = document.querySelector('input#search-box');
const listEl = document.querySelector('.country-list');
const DEBOUNCE_DELAY = 300;

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  const inputValue = event.target.value;
  if (!inputValue) {
    listEl.innerHTML = '';
    return;
  }
  if (inputValue) {
    listEl.innerHTML = '';
  }

  fetchCountries(inputValue.trim())
    .then(result => {
      listEl.insertAdjacentHTML('beforeend', createMarkup(result));

      function createMarkup(result) {
        if (result.length === 1) {
          return result
            .map(({ name, capital, population, flags, languages }) => {
              languages = Object.values(languages).join(', ');
              return `
<li>
<div style="display:flex; align-items:center;">
  <img src="${flags.svg}" alt="flag" width="120" height="60"/>
<p style="font-size:28px; font-weight:700;">${name.official}</p>
</div>
<p style="font-size:18px; font-weight:600;">Capital: <span style="font-size:18px; font-weight:400;">${capital}</span></p>
<p style="font-size:18px; font-weight:600;">Population: <span style="font-size:18px; font-weight:400;">${population}</span></p>
<p style="font-size:18px; font-weight:600;">Languages: <span style="font-size:18px; font-weight:400;">${languages}</span></p>
</li>
      `;
            })
            .join('');
        }

        if (result.length > 2 && result.length <= 10) {
          return result
            .map(({ name, flags }) => {
              return `
<li style="display:flex; align-items:center;">
  <img src="${flags.svg}" alt="flag" width="60" height="30"/>
<p style="font-size:18px; font-weight:600;">${name.official}</p>
</li>
      `;
            })
            .join('');
        }

        if (result.length > 11) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return '';
        }
      }
    })

    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}
