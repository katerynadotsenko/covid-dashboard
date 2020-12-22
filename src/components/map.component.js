/* eslint-disable */
import euCountries from '../helpers/eu-countries.js';
export default class MapComponent {

  constructor() {
    this.mapContainer = '';
    this.getSummary = {};
    this.isAbsoluteData = true;
    this.isTotal = true;
    this.dataValue = ['confirmed', 'deaths', 'recovered'];
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

  render(markersData, summary) {
    this.getSummary = summary;
    // this.mapContainer = document.createElement('div');
    // this.mapContainer.setAttribute('id', 'map');
    // this.mapContainer.style.width = '1024px';
    // this.mapContainer.style.height = '768px';
    this.createMap(markersData);
    return this.mapContainer;
  }

  createMap(markersData, summary) {
    const countries = this.getSummary.Countries;
    //console.log(this.getSummary);
    let iconOptions = {
      iconUrl: '/assets/i.webp',
      iconSize: [9, 9]
    }
    let customIcon = L.icon(iconOptions);
    this.markerOptions = {
      // title: "MyLocation",
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
    let styleGeojson = {
      "color": "#556577",
      "weight": 2,
      "opacity": 0.65
    };
    let geojson = L.geoJson(euCountries, {
      style: styleGeojson
    }).addTo(map);

    geojson.eachLayer(function (layer) {
      // layer.bindPopup(layer.feature.properties.name);
      // console.log(layer.feature.properties.name);
      layer.on('mousemove', function (event) {
        let currentCountry = layer.feature.properties.adm0_a3;
        let totalConfirmed = 'No data';
        for (let key in countries) {
          if (countries[key].alpha3Code === currentCountry || countries[key].Country === layer.feature.properties.name_long) {
            totalConfirmed = countries[key].TotalConfirmed;
          }
        }
        let popup = L.popup()
          .setLatLng(event.latlng)
          .setContent(layer.feature.properties.name + '<br>' + totalConfirmed)
          .openOn(map);
        this.openPopup(popup);
      });
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


    let btnDeaths = L.control({
      position: 'bottomleft'
    });
    btnDeaths.onAdd = function (map) {
      let btnDeaths = L.DomUtil.create('div', 'map-control-button deaths-button');
      btnDeaths.innerHTML = 'Deaths';
      return btnDeaths;
    };
    btnDeaths.addTo(map);
    map.on('click', function (event) {
      console.log(event.target);
    })
    // L.DomEvent
    //   .addListener(btnDeaths, 'click', function (event) {
    //     console.log(event.target);
    //   })

    let btnRecovered = L.control({
      position: 'bottomleft'
    });
    btnRecovered.onAdd = function (map) {
      let btnRecovered = L.DomUtil.create('div', 'map-control-button recovered-button');
      btnRecovered.innerHTML = 'Recovered';
      return btnRecovered;
    };
    btnRecovered.addTo(map);

    let btnConfirmed = L.control({
      position: 'bottomleft'
    });
    btnConfirmed.onAdd = function (map) {
      let btnConfirmed = L.DomUtil.create('div', 'map-control-button confirmed-button');
      btnConfirmed.innerHTML = 'Confirmed';
      return btnConfirmed;
    };
    btnConfirmed.addTo(map);



    for (let key in markersData) {
      // let currentValue = 'confirmed';
      const iconSize = this.generateIconSize(markersData[key].stats.confirmed);
      const iconOptions = {
        iconUrl: '/assets/coronavirusMarker.webp',
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
      iconSize = [10, 10];
    } else if (sumData > 20000 && sumData <= 50000) {
      iconSize = [13, 13];
    } else if (sumData > 50000 && sumData <= 100000) {
      iconSize = [16, 16];
    } else if (sumData > 100000 && sumData <= 250000) {
      iconSize = [20, 20];
    } else if (sumData > 250000 && sumData <= 400000) {
      iconSize = [23, 23];
    } else if (sumData > 400000 && sumData <= 500000) {
      iconSize = [26, 26];
    } else if (sumData > 500000 && sumData <= 1000000) {
      iconSize = [30, 30];
    } else {
      iconSize = [33, 33];
    }
    return iconSize;
  }

  // showPopup(event) {
  //   let popup = l.popup
  //     .setLatLng(event.latlng)
  //     .setContent('<p>Country parameter...</p>')
  //     .openOn(map);
  //   this.openPopup(popup);
  // }

}