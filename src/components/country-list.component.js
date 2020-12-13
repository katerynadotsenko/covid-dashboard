/* eslint-disable import/extensions */
import { appendChildren } from '../helpers/utils.js';
import state from '../helpers/state.js';

export default class CountryListComponent {
  constructor() {
  }

  render(summary) {
    const countries = summary.Countries;
    this.countries = {};
    this.cur = -1;
    countries.forEach((c) => this.countries[c.CountryCode] = c);

    this.countriesWrapper = document.createElement('div');
    this.countriesWrapper.classList.add('countries_wrapper');

    const search = document.createElement('input');
    search.classList.add('search');
    search.placeholder = 'Country search...';
    search.oninput = () => {
      if (search.value) {
        appendChildren(this.countriesContainer, Object.values(this.countriesElements).filter((c) => this.countries[c.id].Country.startsWith(search.value)));
      } else {
        appendChildren(this.countriesContainer, Object.values(this.countriesElements));
      }
    };
    this.countriesWrapper.appendChild(search);

    this.countriesContainer = document.createElement('div');
    this.countriesContainer.classList.add('countries_container');
    this.countriesWrapper.appendChild(this.countriesContainer);

    this.countriesElements = {};
    countries.forEach((c) => {
      const countryElement = document.createElement('div');
      countryElement.classList.add('country');
      countryElement.id = c.CountryCode;
      countryElement.onclick = () => {
        if (state.country) {
          this.countriesElements[state.country].classList.remove('cur');
        }
        if (state.country === countryElement.id) {
          state.country = null;
        } else {
          countryElement.classList.add('cur');
          state.country = countryElement.id;
        }
      };

      const img = document.createElement('img');
      img.src = c.flag;
      img.classList.add('flag');
      countryElement.appendChild(img);

      const number = document.createElement('span');
      number.innerText = c[`${state.when}${state.status}`];
      number.classList.add('cases');
      number.classList.add('confirmed');
      countryElement.appendChild(number);

      const name = document.createElement('span');
      name.innerText = c.Country;
      name.classList.add('country_name');
      countryElement.appendChild(name);

      this.countriesElements[c.CountryCode] = countryElement;
    });
    appendChildren(this.countriesContainer, Object.values(this.countriesElements));
    return this.countriesWrapper;
  }
}
