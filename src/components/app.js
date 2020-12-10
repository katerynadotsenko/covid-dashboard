/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import ChartComponent from './chart.component.js';
import { getDataWorldByDate } from '../service.js';

export default class App {
  constructor() {
    this.chartStartDate = '2020-04-14T00:00:00Z';
    this.chartStartDate = new Date();
    this.mapComponent = new MapComponent();
    this.chartComponent = new ChartComponent(this.chartStartDate);
    this.chartData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    appContainer.append(this.mapComponent.render());

    this.chartData = await getDataWorldByDate(this.chartStartDate, this.chartStartDate);
    this.chartComponent.setCharData(this.chartData);
    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
