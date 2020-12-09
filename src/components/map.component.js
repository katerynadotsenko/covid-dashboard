export default class MapComponent {
  constructor() {
    this.mapContainer = '';
  }

  render() {
    // return нужно вернуть dom элемент - ниже просто пример
    this.mapContainer = document.createElement('div');
    this.mapContainer.innerText = 'Map component works';
    return this.mapContainer;
  }
}
