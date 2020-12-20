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
    const countryListNode = this.countryListComponent.render(this.getSummary);
    appContainer.append(countryListNode);

    this.markersData = await getDataforMarkers();
    const mapNode = this.mapComponent.render(this.markersData, this.getSummary);
    appContainer.append(mapNode);

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');

    this.chartData = await getWorldDataByLastDays();
    this.chartComponent.updateChartData(this.chartData);

    const statisticsNode = this.statisticsComponent.render(this.getSummary);
    rightContainer.append(statisticsNode);
    const chartNode = this.chartComponent.render();
    rightContainer.append(chartNode);
    appContainer.append(rightContainer);

    [chartNode, statisticsNode, countryListNode].forEach(c => {
      c.classList.add('container');
      c.addEventListener('mouseover', changeDefOver);
      c.addEventListener('mouseout', changeDefOut);

      const fullscreenToggle = document.createElement('div');
      fullscreenToggle.classList.add('fullscreenToggle');
      const fullscreenIcon = document.createElement('img');
      fullscreenIcon.classList.add('fullscreenIcon');
      fullscreenIcon.src = '../../assets/icon-fullscreen.png';
      fullscreenToggle.appendChild(fullscreenIcon);
      c.appendChild(fullscreenToggle);

      fullscreenToggle.addEventListener('click', () => {
        c.classList.toggle('fullscreen');
      });

      function changeDefOver(e) {
        fullscreenToggle.classList.add('invis');
      }

      function changeDefOut(e) {
        fullscreenToggle.classList.remove('invis');
      }
    });

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
