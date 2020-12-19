/* eslint-disable */
import euCountries from '../helpers/eu-countries.js';
export default class MapComponent {

  constructor() {
    this.mapContainer = '';
    this.mapOptions = {
      center: [45, 2],
      zoom: 2,
      worldCopyJump: true,
      minZoom: 1,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft'
      }
    }
  }

  render(markersData) {
    console.log(markersData);
    this.mapContainer = document.createElement('div');
    this.mapContainer.setAttribute('id', 'map');
    this.mapContainer.style.width = '1024px';
    this.mapContainer.style.height = '768px';
    this.createMap(markersData);
    return this.mapContainer;
  }

  createMap(markersData) {
    let iconOptions = {
      iconUrl: '/assets/i.webp',

      iconSize: [9, 9]
    }
    let customIcon = L.icon(iconOptions);
    this.markerOptions = {
      title: "MyLocation",
      clickable: true,
      icon: customIcon
    }

    let map = new L.map(this.mapContainer, this.mapOptions);
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
    let styleGeojson = {
      "color": "#556577",
      "weight": 1,
      "opacity": 0.65
    };
    let geojson = L.geoJson(euCountries, {
      style: styleGeojson
    }).addTo(map);
    geojson.eachLayer(function (layer) {
      layer.bindPopup(layer.feature.properties.name);
      // layer.on('mousemove', this.showPopup);
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

    // else if (sumData > 1000 && sumData <= 3000) {
    //   iconSize = [4, 4];
    // } else if (sumData > 3000 && sumData <= 20000) {
    //   iconSize = [5, 5];
    // } else if (sumData > 20000 && sumData <= 50000) {
    //   iconSize = [6, 6];
    // } else if (sumData > 50000 && sumData <= 100000) {
    //   iconSize = [7, 7];
    // } else if (sumData > 100000 && sumData <= 250000) {
    //   iconSize = [8, 8];
    // } else if (sumData > 250000 && sumData <= 400000) {
    //   iconSize = [9, 9];
    // } else if (sumData > 400000 && sumData <= 500000) {
    //   iconSize = [10, 10];
    // } else if (sumData > 500000 && sumData <= 1000000)

    for (let key in markersData) {
      // console.log(data[key].stats);
      let sumConfirmed = markersData[key].stats.confirmed;
      const iconSize = this.generateIconSize(sumConfirmed);
      const iconOptions = {
        iconUrl: '/assets/coronavirus-5058258__480.webp',
        iconSize: iconSize
      };
      const customIcon = L.icon(iconOptions);
      this.markerOptions.icon = customIcon;
      const sumDeaths = markersData[key].stats.deaths;

      let sumRecovered = markersData[key].stats.recovered;
      if (markersData[key].coordinates.latitude !== '') {
        let coordinates = [markersData[key].coordinates.latitude, markersData[key].coordinates.longitude];
        // console.log(coordinates)
        let marker = L.marker(coordinates, this.markerOptions);

        map.addLayer(marker);
        // marker.bindPopup(`${markersData[key].province}<br> deaths: ${sumDeaths} <br> confirmed: ${sumConfirmed} <br> recovered ${sumRecovered}`).openPopup();
        // map.addLayer(marker);
      }
    }

  }

  generateIconSize(sumData) {
    let iconSize = [];
    if (sumData <= 1000) {
      iconSize = [6, 6];
    } else if (sumData > 1000 && sumData <= 3000) {
      iconSize = [7, 7];
    } else if (sumData > 3000 && sumData <= 20000) {
      iconSize = [8, 8];
    } else if (sumData > 20000 && sumData <= 50000) {
      iconSize = [9, 9];
    } else if (sumData > 50000 && sumData <= 100000) {
      iconSize = [10, 10];
    } else if (sumData > 100000 && sumData <= 250000) {
      iconSize = [11, 11];
    } else if (sumData > 250000 && sumData <= 400000) {
      iconSize = [12, 12];
    } else if (sumData > 400000 && sumData <= 500000) {
      iconSize = [13, 13];
    } else if (sumData > 500000 && sumData <= 1000000) {
      iconSize = [15, 15];
    } else {
      iconSize = [17, 17];
    }
    return iconSize;
  }

  showPopup(event) {
    let popup = l.popup
      .setLatLng(event.latlng)
      .setContent('<p>Country parameter...</p>')
      .openOn(map);
    this.openPopup(popup);
  }

}