/* eslint-disable import/extensions */
/* import Chart from 'chart.js'; */
import { normalizeDate } from '../helpers/utils.js';

export default class ChartComponent {
  constructor(isWorldMode, isAbsoluteData, isEntirePeriodData, population) {
    this.chartData = [];
    this.chartContainer = '';
    this.chart = '';
    this.chartConfig = '';
    this.chartInfoPanel = '';
    this.isWorldMode = true; // TODO
    this.isAbsoluteData = false; // TODO
    this.isEntirePeriodData = false; // TODO
    this.population = 38437239; // TODO
    this.statisticsModes = ['Daily Cases', 'Daily Recoveries', 'Daily Deaths'];
    this.statisticsModeNumber = 0; // TODO
    this.chartStyles = {
      mainColor: 'rgba(255, 170, 0, 1)',
      tooltipsBg: 'rgba(255, 255, 255, 0.8)',
      tooltipFontColor: 'rgba(29, 29, 29, 1)',
      gridLinesColor: 'rgba(61, 61, 61, 1)',
      ticksColor: 'rgb(149, 149, 149)',
      transparent: 'rgb(0, 0, 0, 0)',
    };
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

    const charDataToShow = this.getDailyData('cases');

    this.chartContainer.append(this.generateChart(charDataToShow));
    this.chartContainer.append(chartNavigation);

    // this.updateChart(data, false);

    return this.chartContainer;
  }

  bindNavigationListeners(navDirection) {
    const maxLength = this.statisticsModes.length - 1;
    const extraText = this.isAbsoluteData ? 'per 100,000 population' : '';
    if (navDirection === 'next') {
      if (this.statisticsModeNumber < maxLength) {
        this.statisticsModeNumber += 1;
        this.chartInfoPanel.innerText = `${this.statisticsModes[this.statisticsModeNumber]} ${extraText}`;
        this.updateChart(this.getDataToShow());
      }
    } else if (this.statisticsModeNumber > 0) {
      this.statisticsModeNumber -= 1;
      this.chartInfoPanel.innerText = `${this.statisticsModes[this.statisticsModeNumber]} ${extraText}`;
      this.updateChart(this.getDataToShow());
    }
  }

  updateChartData(chartData) {
    this.chartData = chartData;
  }

  updateChartMode(isWorldMode) {
    this.isWorldMode = isWorldMode;
  }

  updateChartByActiveCountry(chartData) {
    this.updateChartData(chartData);
    this.updateChart(this.getDataToShow());
  }

  changePeriodDataMode(isEntirePeriodData) {
    this.isEntirePeriodData = isEntirePeriodData;
  }

  changeChartType() {
    this.chart.destroy();
    const chartCanvas = this.chartContainer.querySelector('.chart-canvas');
    const chartType = this.isEntirePeriodData ? 'line' : 'bar';
    this.chart = new Chart(chartCanvas, this.generateChartConfig(chartType, null));
  }

  updateChart(chartData) {
    //this.changeChartType();
    this.chart.data.datasets[0].data = chartData;
    this.chart.update({
      duration: 300,
      easing: 'linear',
    });
  }

  getDataToShow() {
    let charDataToShow = [];
    switch (this.statisticsModes[this.statisticsModeNumber]) {
      case 'Daily Cases':
        charDataToShow = this.getDailyData('cases');
        break;
      case 'Daily Recoveries':
        charDataToShow = this.getDailyData('recovered');
        break;
      case 'Daily Deaths':
        charDataToShow = this.getDailyData('deaths');
        break;
      default:
        break;
    }

    return charDataToShow;
  }

  getDailyData(parameter) {
    let prevItem = 0;
    return Object.entries(this.chartData[parameter]).map((item) => {
      const [date, quantity] = item;
      const quantityToCalc = this.isEntirePeriodData ? quantity : quantity - prevItem;
      const resultQuantity = this.isAbsoluteData
        ? ((quantityToCalc / this.population) * 100000).toFixed(3)
        : quantityToCalc;
      const itemData = { x: new Date(date), y: resultQuantity };
      prevItem = quantity;
      if (itemData.y < 0) {
        console.log(itemData.y);
      }
      return itemData;
    });
  }

  generateChart(charDataToShow) {
    const chartCanvas = document.createElement('canvas');
    chartCanvas.classList.add('chart-canvas');
    chartCanvas.getContext('2d');
    this.chart = new Chart(chartCanvas, this.generateChartConfig('bar', charDataToShow));
    return chartCanvas;
  }

  generateChartConfig(chartType, charDataToShow) {
    const datasets = [{
      data: charDataToShow,
      backgroundColor: this.chartStyles.mainColor,
      barPercentage: 1,
      barThickness: 'flex',
      categoryPercentage: 1,
    }];
    if (this.isEntirePeriodData) {
      datasets[0].backgroundColor = this.chartStyles.transparent;
      datasets[0].borderColor = this.chartStyles.mainColor;
      datasets[0].pointBackgroundColor = this.chartStyles.mainColor;
    }
    return {
      type: `${chartType}`,
      data: {
        datasets,
      },
      options: {
        legend: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 200000,
              fontColor: this.chartStyles.ticksColor,
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
            gridLines: {
              borderDash: [4, 3],
              color: this.chartStyles.gridLinesColor,
            },
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'month',
            },
            ticks: {
              beginAtZero: true,
              fontColor: this.chartStyles.ticksColor,
            },
            gridLines: {
              borderDash: [4, 3],
              color: this.chartStyles.gridLinesColor,
              offsetGridLines: true,
            },
          }],
        },
        tooltips: {
          backgroundColor: this.chartStyles.tooltipsBg,
          borderColor: this.chartStyles.mainColor,
          borderWidth: 1,
          titleFontColor: this.chartStyles.tooltipFontColor,
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
    };
  }
}
