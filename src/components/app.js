/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import ChartComponent from './chart.component.js';
import { getWorldDataByLastDays, getCountryDataByLastDays } from '../service.js';

export default class App {
  constructor() {
    this.mapComponent = new MapComponent();
    this.chartComponent = new ChartComponent();
    this.chartData = [];
  }

  async init() {
    const appContainer = document.querySelector('.app-container');

    appContainer.append(this.mapComponent.render());

    this.chartData = await getWorldDataByLastDays(); //for world
    this.chartComponent.updateChartData(this.chartData); //for world

    //this.chartData = await getCountryDataByLastDays('poland'); //for country
    //this.chartComponent.updateChartData(this.chartData.timeline); //for country

    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
