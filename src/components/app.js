/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import ChartComponent from './chart.component.js';
import { getDataWorldByLastDays } from '../service.js';

export default class App {
  constructor() {
    this.mapComponent = new MapComponent();
    this.chartComponent = new ChartComponent();
    this.chartData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    appContainer.append(this.mapComponent.render());

    this.chartData = await getDataWorldByLastDays();
    this.chartComponent.updateChartData(this.chartData);
    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
