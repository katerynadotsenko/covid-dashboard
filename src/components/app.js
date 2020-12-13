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

    appContainer.append(this.mapComponent.render());

    this.getSummary = await getSummary();
    appContainer.append(this.countryListComponent.render(this.getSummary));

    appContainer.append(this.statisticsComponent.render(this.getSummary));

    this.chartData = await getWorldDataByLastDays(); //for world
    this.chartComponent.updateChartData(this.chartData); //for world

    //this.chartData = await getCountryDataByLastDays('poland'); //for country
    //this.chartComponent.updateChartData(this.chartData.timeline); //for country
    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
