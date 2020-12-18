/* eslint-disable */
import euCountries from '../helpers/eu-countries.js';
export default class MapComponent {

  constructor() {
    this.mapContainer = '';
    this.mapOptions = {
      center: [45, 10],
      zoom: 2,
      worldCopyJump: true,
      minZoom: 1,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft'
      }
    }
    let iconOptions = {
      iconUrl: '/assets/circle.svg',
      iconSize: [9, 9]
    }
    let customIcon = L.icon(iconOptions);
    this.markerOptions = {
      title: "MyLocation",
      clickable: true,
      icon: customIcon
    }

    let map = new L.map('map', this.mapOptions);
    // let layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    let layer = new L.TileLayer('https://api.mapbox.com/styles/v1/general-m/ckij3fcw82az119mgnjhkeu2m/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VuZXJhbC1tIiwiYSI6ImNraWozZjdrdjJkbWYycnBlNmw5N3RhNjgifQ.awd7EvjA7RM8Dl4Xb_5dBA');
    map.addLayer(layer);

    // Подсветка стран через geojson
    map.createPane('labels');
    map.getPane('labels').style.zIndex = 650;
    map.getPane('labels').style.pointerEvents = 'none';
    let positron = L.tileLayer('https://api.mapbox.com/styles/v1/general-m/ckij3fcw82az119mgnjhkeu2m/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VuZXJhbC1tIiwiYSI6ImNraWozZjdrdjJkbWYycnBlNmw5N3RhNjgifQ.awd7EvjA7RM8Dl4Xb_5dBA').addTo(map);
    let positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      pane: 'labels'
    }).addTo(map);
    let geojson = L.geoJson(euCountries).addTo(map);
    geojson.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.properties.name);
    });

    /// Легенда карты
    let info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      this.update();
      return this._div;
    };
    info.update = function (props) {
      this._div.innerHTML = 'Legend <br> 11111 <br> 2222 <br> 3333';
    };
    info.addTo(map);

    // Получение координат по движению мыши по карте
    // map.on('mousemove', getShowPopup);
    // let geoDataLat, geoDataLong;
    // function getShowPopup(event) {
    //   var popup = L.popup()
    //     .setLatLng(event.latlng)
    //     .setContent('<p>Country parameter...</p>')
    //     .openOn(map);
    //   map.openPopup(popup);
    //   geoDataLat = event.latlng.lat;
    //   geoDataLong = event.latlng.lng;
    //   // console.log(event.latlng);
    //   fetch(https://nominatim.openstreetmap.org/search.php?q=${geoDataLat}%2C%20${geoDataLong}&polygon_geojson=1&format=jsonv2)
    //     .then(res => res.json())
    //     .then(data => data)
    //     .then(data => {
    //       console.log(data);
    //     })
    //     .catch(() => console.log('error..'))
    // }


    fetch('https://disease.sh/v3/covid-19/jhucsse')
      .then(res => res.json())
      .then(data => data)
      .then(data => {
        for (let key in data) {
          // console.log(data[key].stats);
          let sumDeaths = data[key].stats.deaths;
          let sumConfirmed = data[key].stats.confirmed;
          let sumRecovered = data[key].stats.recovered;
          if (data[key].coordinates.latitude !== '') {
            let coordinates = [data[key].coordinates.latitude, data[key].coordinates.longitude];
            // console.log(coordinates)
            let marker = L.marker(coordinates, this.markerOptions);
            map.addLayer(marker);
            marker.bindPopup(`${data[key].province}<br> deaths: ${sumDeaths} <br> confirmed: ${sumConfirmed} <br> recovered ${sumRecovered}`).openPopup();
            map.addLayer(marker);
          }
        }
      })
      .catch(() => console.log('error..'))

  }

  render() {

    // return нужно вернуть dom элемент - ниже просто пример
    // this.mapContainer = document.createElement('div');
    // this.mapContainer.classList.add('#map')
    //this.mapContainer.innerText = 'Map component works';
    return this.mapContainer;
  }
}