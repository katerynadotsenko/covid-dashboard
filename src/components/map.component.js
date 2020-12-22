/* eslint-disable */
import euCountries from '../helpers/eu-countries.js';
import ControlPanelComponent from './control-panel.component.js';
export default class MapComponent {

  constructor(changeAppPeriodMode, changeAppDataTypeMode) {
    this.changeAppPeriodMode = changeAppPeriodMode;
    this.changeAppDataTypeMode = changeAppDataTypeMode;
    this.controlPanelComponent = new ControlPanelComponent(
      this.changeAppPeriodMode, this.changeAppDataTypeMode,
    );
    this.mapContainer = '';
    this.getSummary = {};
    this.activeCountryCode = '';
    this.dataToPopup = 'Confirmed';
    this.currentIndex = 'Confirmed';
    this.isAbsoluteData = true;
    this.isTotal = true;
    this.markers = [];
    this.dataValue = ['Confirmed', 'Deaths', 'Recovered'];
    this.mapOptions = {
      center: [45, 40],
      zoom: 2,
      worldCopyJump: true,
      minZoom: 1,
      fullscreenControl: true,
      fullscreenControlOptions: {
        position: 'topleft'
      }
    }

    this.map = new L.map('map', this.mapOptions);

    let styleGeojson = {
      "color": "#556577",
      "weight": 2,
      "opacity": 0.65
    };

    this.geojson = L.geoJson(euCountries, {
      style: styleGeojson
    }).addTo(this.map);

  }

  render(markersData, summary) {
    this.getSummary = summary;
    this.createMap(markersData);

    // this.getMarkers(markersData);
    // this.getDataToPopup();
    this.controlPanelComponent.addControlPanel(this.mapContainer);
    return this.mapContainer;
  }

  createMap(markersData, summary, marker) {
    const countries = this.getSummary.Countries;

    //const map = new L.map('map', this.mapOptions);
    // let layer = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
    let layer = new L.TileLayer('https://api.mapbox.com/styles/v1/general-m/ckij3fcw82az119mgnjhkeu2m/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VuZXJhbC1tIiwiYSI6ImNraWozZjdrdjJkbWYycnBlNmw5N3RhNjgifQ.awd7EvjA7RM8Dl4Xb_5dBA');
    this.map.addLayer(layer);

    // Подсветка стран через geojson
    this.map.createPane('labels');
    this.map.getPane('labels').style.zIndex = 650;
    this.map.getPane('labels').style.pointerEvents = 'none';
    let positron = L.tileLayer('https://api.mapbox.com/styles/v1/general-m/ckij3fcw82az119mgnjhkeu2m/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VuZXJhbC1tIiwiYSI6ImNraWozZjdrdjJkbWYycnBlNmw5N3RhNjgifQ.awd7EvjA7RM8Dl4Xb_5dBA').addTo(this.map);
    let positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
      pane: 'labels'
    }).addTo(this.map);


    this.geojson.eachLayer((layer) => {
      layer.on('click', function (event) {
        this.activeCountryCode = layer.feature.properties.adm0_a3;
      })
      layer.on('mousemove', (event) => {
        let currentCountry = layer.feature.properties.adm0_a3;
        let totalValue = 'No data';
        for (let key in countries) {
          // console.log(countries[key])
          if (countries[key].alpha3Code === currentCountry || countries[key].Country === layer.feature.properties.name_long) {
            if (this.isTotal) {
              totalValue = countries[key]['Total' + this.dataToPopup];
            }
            else {
              totalValue = countries[key]['New' + this.dataToPopup];
            }
            if (!this.isAbsoluteData) {
              totalValue = ((totalValue / countries[key].population) * 100000).toFixed(3)
            }
          }
        }
        let popup = L.popup()
          .setLatLng(event.latlng)
          .setContent(layer.feature.properties.name + '<br>' + this.dataToPopup + ': ' + totalValue)
          .openOn(layer._map);
        //L.openPopup(popup);
      });
    });

    /// Легенда карты
    let info = L.control();
    info.onAdd = function (map) {
      this._div = L.DomUtil.create('div', 'info');
      let iconSize = [6, 7, 10, 13, 16, 20, 23, 26, 30, 33]
      let grades = ["<1k", "1k-3k", "3k-20k", "20k-50k", "50k-100k", "100k-250k", "250k-400k", "400k-500k", "500k-1000k", ">1000k"],
        labels = ['<strong>Size markers</strong>'],
        from, to;
      //iterate through grades and create a scaled circle and label for each
      for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
          '<div class="legend"> <img src= "/assets/coronavirusMarker.webp" style="background-size:contain ;  width:' + iconSize[i] + 'px;height:' + iconSize[i] + 'px; border-radius: 100%; "></img> ' + from + '</div>');
      }
      this._div.innerHTML = labels.join(' ');

      // this.update();
      return this._div;
    };
    // info.update = function (props) {
    //   this._div.innerHTML = 'Legend <br> <i class="circlepadding" style="width: 5px;"></i> <1000 <br> 1000-3000 <br> 3000-20000';
    // };
    info.addTo(this.map);

    // if (sumData <= 1000) {
    //   iconSize = [6, 6];
    // } else if (sumData > 1000 && sumData <= 3000) {
    //   iconSize = [7, 7];
    // } else if (sumData > 3000 && sumData <= 20000) {
    //   iconSize = [10, 10];
    // } else if (sumData > 20000 && sumData <= 50000) {
    //   iconSize = [13, 13];
    // } else if (sumData > 50000 && sumData <= 100000) {
    //   iconSize = [16, 16];
    // } else if (sumData > 100000 && sumData <= 250000) {
    //   iconSize = [20, 20];
    // } else if (sumData > 250000 && sumData <= 400000) {
    //   iconSize = [23, 23];
    // } else if (sumData > 400000 && sumData <= 500000) {
    //   iconSize = [26, 26];
    // } else if (sumData > 500000 && sumData <= 1000000) {
    //   iconSize = [30, 30];
    // } else {
    //   iconSize = [33, 33];


    let btnDeaths = L.control({
      position: 'bottomleft'
    });
    btnDeaths.onAdd = function (map) {
      let btnDeaths = L.DomUtil.create('div', 'map-control-button deaths-button');
      btnDeaths.innerHTML = 'Deaths';
      return btnDeaths;
    };
    btnDeaths.addTo(this.map);
    this.map.on('click', (event) => {
      // console.log(this.map);
      console.log(event.originalEvent.target.innerHTML);
      let btnCurrentIndex = event.originalEvent.target.innerHTML;
      if (this.dataValue.includes(btnCurrentIndex)) {
        this.dataToPopup = this.getDataToPopup(btnCurrentIndex);
        this.showMarkers(markersData);
      }

      return this.dataToPopup;
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
    btnRecovered.addTo(this.map);

    let btnConfirmed = L.control({
      position: 'bottomleft'
    });
    btnConfirmed.onAdd = function (map) {
      let btnConfirmed = L.DomUtil.create('div', 'map-control-button confirmed-button');
      btnConfirmed.innerHTML = 'Confirmed';
      return btnConfirmed;
    };
    btnConfirmed.addTo(this.map);

    this.showMarkers(markersData);

  }

  showMarkers(markersData) {

    /// удаляем маркеры
    if (this.markers) {
      for (let i = 0; i < this.markers.length; i++) {
        this.map.removeLayer(this.markers[i]);
      }
    }

    /// Добавляем маркеры
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
    for (let key in markersData) {
      const iconSize = this.generateIconSize(markersData[key].stats[this.dataToPopup.toLowerCase()]);
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
        let marker = L.marker(coordinates, this.markerOptions);
        this.map.addLayer(marker);
        this.markers.push(marker);
        //console.log(this.markers);
      }
    }
  }

  getDataToPopup(currentIndex) {
    let dataToPopup = '';
    switch (currentIndex) {
      case 'Confirmed':
        dataToPopup = 'Confirmed';
        break;
      case 'Deaths':
        dataToPopup = 'Deaths';
        break;
      case 'Recovered':
        dataToPopup = 'Recovered';
        break;
      default:
        break;
    }

    return dataToPopup;
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