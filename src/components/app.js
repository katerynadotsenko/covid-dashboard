/* eslint-disable import/extensions */
import MapComponent from './map.component.js';
import ChartComponent from './chart.component.js'

export default class App {
  constructor() {
    this.mapComponent = new MapComponent(/*data*/);
    this.chartComponent = new ChartComponent();
  }

  init() {
    const appContainer = document.querySelector('.app-container');
    appContainer.append(this.mapComponent.render());
    appContainer.append(this.chartComponent.render());

    return appContainer;
  }
}
