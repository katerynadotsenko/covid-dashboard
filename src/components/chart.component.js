/* eslint-disable import/extensions */
/* import Chart from 'chart.js'; */
import { normalizeDate } from '../helpers/utils.js';

export default class ChartComponent {
  constructor(isWorld, statisticsMode) {
    this.chartData = [];
    this.chartContainer = '';
    this.chart = '';
    this.chartInfoPanel = '';
    this.isWorld = true; // TODO
    this.statisticsModes = ['daily cases', 'daily recoveries', 'daily deaths'];
    this.statisticsModeNumber = 0; // TODO
  }

  render() {
    this.chartContainer = document.createElement('div');
    this.chartContainer.classList.add('chart-container');

    const chartNavigation = document.createElement('div');
    chartNavigation.classList.add('chart-navigation');

    const prevNavigation = document.createElement('button');
    prevNavigation.innerText = 'prev';
    prevNavigation.addEventListener('click', () => this.bindNavigationListeners('prev'));

    const nextNavigation = document.createElement('button');
    nextNavigation.innerText = 'next';
    nextNavigation.addEventListener('click', () => this.bindNavigationListeners('next'));

    this.chartInfoPanel = document.createElement('span');
    this.chartInfoPanel.innerText = this.statisticsModes[this.statisticsModeNumber];

    chartNavigation.append(prevNavigation);
    chartNavigation.append(this.chartInfoPanel);
    chartNavigation.append(nextNavigation);

    const charDataToShow = this.getWorldDataForDailyCases();

    this.chartContainer.append(this.generateChart(charDataToShow));
    this.chartContainer.append(chartNavigation);

    // this.updateChart(data, false);

    return this.chartContainer;
  }

  bindNavigationListeners(navDirection) {
    const maxLength = this.statisticsModes.length - 1;
    if (navDirection === 'next') {
      if (this.statisticsModeNumber < maxLength) {
        this.statisticsModeNumber += 1;
        this.chartInfoPanel.innerText = this.statisticsModes[this.statisticsModeNumber];
        this.updateChart(this.getDataToShow());
      }
    } else if (this.statisticsModeNumber > 0) {
      this.statisticsModeNumber -= 1;
      this.chartInfoPanel.innerText = this.statisticsModes[this.statisticsModeNumber];
      this.updateChart(this.getDataToShow());
    }
  }

  updateChartData(chartData) {
    this.chartData = chartData;
  }

  updateIsWorld(isWorld) {
    this.isWorld = isWorld;
  }

  updateChart(chartData) {
    this.chart.data.datasets[0].data = chartData;
    this.chart.update({
      duration: 300,
      easing: 'linear',
    });
  }

  getDataToShow() {
    let charDataToShow = [];
    switch (this.statisticsModes[this.statisticsModeNumber]) {
      case 'daily cases':
        charDataToShow = this.isWorld
          ? this.getWorldDataForDailyCases()
          : this.getCountryDataForDailyCases();
        break;
      case 'daily recoveries':
        charDataToShow = this.isWorld
          ? this.getWorldDataForDailyRecoveries()
          : this.getWorldDataForDailyRecoveries(); // TODO
        break;
      case 'daily deaths':
        charDataToShow = this.isWorld
          ? this.getWorldDataForDailyDeaths()
          : this.getWorldDataForDailyDeaths(); // TODO
        break;
      default:
        break;
    }

    return charDataToShow;
  }

  getWorldDataForDailyCases() {
    let prevItem = 0;
    return Object.entries(this.chartData.cases).map((item) => {
      const [date, quantity] = item;
      const itemData = { x: new Date(date), y: quantity - prevItem };
      prevItem = quantity;
      return itemData;
    });
  }

  getWorldDataForDailyRecoveries() {
    let prevItem = 0;
    return Object.entries(this.chartData.recovered).map((item) => {
      const [date, quantity] = item;
      const itemData = { x: new Date(date), y: quantity - prevItem };
      prevItem = quantity;
      return itemData;
    });
  }

  getWorldDataForDailyDeaths() {
    let prevItem = 0;
    return Object.entries(this.chartData.deaths).map((item) => {
      const [date, quantity] = item;
      const itemData = { x: new Date(date), y: quantity - prevItem };
      prevItem = quantity;
      return itemData;
    });
  }

  getCountryDataForDailyCases() {
    if (!Array.isArray(this.chartData)) {
      console.log('getChartDataForDailyCases error'); // TODO
    }
    return this.chartData.map((item) => ({ x: item.Date, y: item.Confirmed }));
  }

  generateChart(charDataToShow) {
    const chartCanvas = document.createElement('canvas');
    chartCanvas.getContext('2d');
    this.chart = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        datasets: [{
          data: charDataToShow,
          backgroundColor: 'rgba(255, 170, 0, 1)',
          hoverBackgroundColor: 'rgba(255, 170, 0, .8)',
          barPercentage: 1,
          barThickness: 'flex',
          categoryPercentage: 1,
        }],
      },
      options: {
        legend: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 200000,
              callback: (value) => {
                const ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' },
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i += 1) {
                    if (n >= ranges[i].divider) {
                      return (n / ranges[i].divider).toString() + ranges[i].suffix;
                    }
                  }
                  return n;
                }
                return formatNumber(value);
              },
            },
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month',
            },
            ticks: {
              beginAtZero: true,
            },
          }],
        },
        tooltips: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'rgba(255, 170, 0, 1)',
          borderWidth: 1,
          titleFontColor: 'rgba(29, 29, 29, 1)',
          callbacks: {
            title(tooltipItem) {
              let label = '';
              const date = new Date(tooltipItem[0].label);

              label += normalizeDate(date);
              return `${label}: ${tooltipItem[0].value}`;
            },
            label() {
              return '';
            },
          },
        },
      },
    });
    return chartCanvas;
  }
}
