// eslint-disable-next-line import/extensions
import MapComponent from './map.component.js';

export default class App {
  constructor() {
    this.mapComponent = new MapComponent(/*data*/);
  }

  init() {
    const appContainer = document.querySelector('.app-container');
    appContainer.append(this.mapComponent.render());
    return appContainer;
  }
}
