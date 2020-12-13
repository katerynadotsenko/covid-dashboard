/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import CountryListComponent from './country-list.component.js';
import ChartComponent from './chart.component.js';
import { getWorldDataByLastDays, getCountryDataByLastDays, getSummary } from '../service.js';
import StatisticsComponent from './statistics.component.js';
import state from '../helpers/state.js';

export default class App {
  constructor() {
    this.mapComponent = new MapComponent();
    this.chartComponent = new ChartComponent();
    this.statisticsComponent = new StatisticsComponent();
    this.countryListComponent = new CountryListComponent();
    this.chartData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    this.getSummary = await getSummary();
    appContainer.append(this.countryListComponent.render(this.getSummary));

    appContainer.append(this.mapComponent.render());

    const rightContainer = document.createElement('div');
    rightContainer.classList.add('right-container');

    this.chartData = await getWorldDataByLastDays(); //for world
    this.chartComponent.updateChartData(this.chartData); //for world

    //this.chartData = await getCountryDataByLastDays('poland'); //for country
    //this.chartComponent.updateChartData(this.chartData.timeline); //for country

    rightContainer.append(this.statisticsComponent.render(this.getSummary));
    rightContainer.append(this.chartComponent.render());
    appContainer.append(rightContainer);

    return appContainer;
  }
}
