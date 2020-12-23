/* eslint-disable import/extensions */
import ControlPanelComponent from './control-panel.component.js';
import { appendChildren, normalizeDate, addButton, addElement } from '../helpers/utils.js';
import state from '../helpers/state.js';

export default class CountryListComponent {
  constructor(updateAppByActiveCountry, changeAppPeriodMode, changeAppDataTypeMode) {
    this.updateAppByActiveCountry = updateAppByActiveCountry;
    this.changeAppPeriodMode = changeAppPeriodMode;
    this.changeAppDataTypeMode = changeAppDataTypeMode;
    this.controlPanelComponent = new ControlPanelComponent(
      this.changeAppPeriodMode, this.changeAppDataTypeMode,
    );
    this.countriesWrapper = '';
    this.isTotal = true;
    this.isAbsoluteData = true;
    this.isWorld = true;
    this.statisticsCategories = ['Confirmed', 'Deaths', 'Recovered'];
    this.activeStatisticsCategory = 0;
  }

  render(summary) {
    this.summary = summary
    
    const countries = summary.Countries;
    this.countries = {};
    this.cur = -1;
    countries.forEach((c) => this.countries[c.CountryCode] = c);

    this.countriesWrapper = document.createElement('div');
    this.countriesWrapper.classList.add('countries_wrapper');

    const search = document.createElement('input');
    search.classList.add('search');
    search.classList.add('use-keyboard-input');
    search.placeholder = 'Country search...';
    search.onfocus = () => {
      if (search.value) {
        appendChildren(this.countriesContainer, Object.values(this.countriesElements).filter((c) => this.countries[c.id].Country.toUpperCase().startsWith(search.value.toUpperCase())));
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
        this.updateAppByActiveCountry(c.CountryCode, c.population);
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


    const chartNavigation = addElement(
      this.countriesWrapper,
      'div',
      ['chart-navigation'],
      '',
    );

    addButton(
      chartNavigation,
      ['button'],
      `<span class='material-icons'>
      arrow_left
      </span>`,
      () => this.changeActiveStatisticsCategory(this.activeStatisticsCategory - 1),
    );

    this.chartInfoPanel = addElement(
      chartNavigation,
      'span',
      ['chart-navigation__info'],
      `Cumulative ${this.statisticsCategories[this.activeStatisticsCategory]}`,
    );

    addButton(
      chartNavigation,
      ['button'],
      `<span class='material-icons'>
      arrow_right
      </span>`,
      () => this.changeActiveStatisticsCategory(this.activeStatisticsCategory + 1),
    );

    this.controlPanelComponent.addControlPanel(this.countriesWrapper);
    return this.countriesWrapper;
  }

  updateTableData(data) {
    this.tableData = data;
  }

  updateTableByWorldData() {
    this.summary.Countries.forEach((c) => {
      const txt = document.querySelector(`#${c.CountryCode} > .cases`);
      if(txt) txt.innerHTML = parseFloat((c[`${this.isTotal? 'Total': 'New'}${this.statisticsCategories[this.activeStatisticsCategory]}`] / (this.isAbsoluteData ? 1 : c.population / 100000)).toFixed(2));
    });
    const search = document.querySelector('.search');
    if (search.value) {
      appendChildren(this.countriesContainer, Object.values(this.countriesElements).filter((c) => this.countries[c.id].Country.toUpperCase().startsWith(search.value.toUpperCase())));
    } else {
      appendChildren(this.countriesContainer, Object.values(this.countriesElements));
    }
  }

  changePeriodMode(isTotal) {
    this.isTotal = isTotal;
    this.updateTableByWorldData();
  }

  changeDataTypeMode(isAbsoluteData) {
    this.isAbsoluteData = isAbsoluteData;
    this.updateTableByWorldData();
  }


  changeChartInfoText() {
    const extraTextFirst = this.isTotal ? 'Cumulative' : 'Daily';
    const extraTextLast = this.isAbsoluteData ? '' : 'per 100,000 population';
    this.chartInfoPanel.innerText = `${this.statisticsCategories[this.activeStatisticsCategory]}`;
  }

  changeActiveStatisticsCategory(categoryNumber) {
    let nextCategoryNumber = categoryNumber;
    if (nextCategoryNumber < 0) {
      nextCategoryNumber = 0;
      return;
    }
    if (nextCategoryNumber > this.statisticsCategories.length - 1) {
      nextCategoryNumber = this.statisticsCategories.length - 1;
      return;
    }
    this.activeStatisticsCategory = nextCategoryNumber;
    this.onChangeStatisticsCategory();
  }

  onChangeStatisticsCategory() {
    this.changeChartInfoText();
    this.updateTableByWorldData();
  }
}
