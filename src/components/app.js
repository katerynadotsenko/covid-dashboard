/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import CountryListComponent from './country-list.component.js';
import ChartComponent from './chart.component.js';
import { getWorldDataByLastDays, getCountryDataByLastDays, getSummary, getDataforMarkers } from '../service.js';
import StatisticsComponent from './statistics.component.js';
import state from '../helpers/state.js';

export default class App {
  constructor() {
    this.mapComponent = new MapComponent();
    this.chartComponent = new ChartComponent(
      (isTotalMode) => this.changeAppPeriodMode(isTotalMode),
      (isAbsoluteMode) => this.changeAppDataTypeMode(isAbsoluteMode),
    );
    this.statisticsComponent = new StatisticsComponent();
    this.countryListComponent = new CountryListComponent(
      (countryCode) => this.updateAppByActiveCountry(countryCode),
    );
    this.chartData = [];
    this.activeCountry = '';
    this.isTotal = true;
    this.isAbsoluteData = true;
    this.markersData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    this.getSummary = await getSummary();
    appContainer.append(this.countryListComponent.render(this.getSummary));

    this.markersData = await getDataforMarkers();
    appContainer.append(this.mapComponent.render(this.markersData, this.getSummary));

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');

    this.chartData = await getWorldDataByLastDays();
    this.chartComponent.updateChartData(this.chartData);

    rightContainer.append(this.statisticsComponent.render(this.getSummary));
    rightContainer.append(this.chartComponent.render());
    appContainer.append(rightContainer);

    return appContainer;
  }

  changeAppPeriodMode(isTotal) {
    this.isTotal = isTotal;
    this.chartComponent.changePeriodMode(isTotal);
  }

  changeAppDataTypeMode(isAbsoluteData) {
    this.isAbsoluteData = isAbsoluteData;
    this.chartComponent.changeDataTypeMode(isAbsoluteData);
  }

  setActiveCountry(countryCode) {
    this.activeCountry = countryCode;
  }

  async updateAppByActiveCountry(countryCode) {
    this.setActiveCountry(countryCode);
    this.chartData = await getCountryDataByLastDays(countryCode);
    if (this.chartData.status === 404) {
      this.chartComponent.showErrorMessage();
    }
    if (!this.chartData.status) {
      this.chartComponent.updateChartByActiveCountry(this.chartData.timeline);
    }
  }
}
