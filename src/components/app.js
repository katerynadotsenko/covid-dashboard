/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import CountryListComponent from './country-list.component.js';
import ChartComponent from './chart.component.js';
import StatisticsComponent from './statistics.component.js';
import { getDataWorldByDate, getSummary } from '../service.js';
import state from '../helpers/state.js';

export default class App {
  constructor() {
    this.chartStartDate = '2020-04-14T00:00:00Z';
    this.chartStartDate = new Date();
    this.mapComponent = new MapComponent();
    this.StatisticsComponent = new StatisticsComponent();
    this.CountryListComponent = new CountryListComponent();
    this.chartComponent = new ChartComponent(this.chartStartDate);
    this.chartData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    appContainer.append(this.mapComponent.render());

    this.getSummary = await getSummary();
    appContainer.append(this.CountryListComponent.render(this.getSummary));

    appContainer.append(this.StatisticsComponent.render(this.getSummary));

    this.chartData = await getDataWorldByDate(this.chartStartDate, this.chartStartDate);
    this.chartComponent.setCharData(this.chartData);
    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
