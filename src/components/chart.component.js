/* eslint-disable import/extensions */
/* import Chart from 'chart.js'; */
import ControlPanelComponent from './control-panel.component.js';

import { normalizeDate, addButton, addElement } from '../helpers/utils.js';

export default class ChartComponent {
  constructor(/* isAbsoluteData, isTotal, population, */ changeAppPeriodMode, changeAppDataTypeMode) {
    this.changeAppPeriodMode = changeAppPeriodMode;
    this.changeAppDataTypeMode = changeAppDataTypeMode;
    this.controlPanelComponent = new ControlPanelComponent(
      this.changeAppPeriodMode, this.changeAppDataTypeMode,
    );
    this.chartData = [];
    this.chartContainer = '';
    this.chart = '';
    this.chartConfig = '';
    this.chartInfoPanel = '';
    this.errorMessage = '';
    this.isAbsoluteData = true;
    this.isTotal = true;
    this.population = 38437239; // TODO
    this.statisticsCategories = ['Daily Cases', 'Daily Recoveries', 'Daily Deaths'];
    this.activeStatisticsCategory = 0;
    this.chartStyles = {
      mainColor: 'rgba(255, 170, 0, 1)',
      tooltipsBg: 'rgba(255, 255, 255, 0.8)',
      tooltipFontColor: 'rgba(29, 29, 29, 1)',
      gridLinesColor: 'rgba(61, 61, 61, 1)',
      ticksColor: 'rgb(149, 149, 149)',
      transparent: 'rgb(0, 0, 0, 0)',
    };
    this.switch = '';
  }

  render() {
    this.chartContainer = addElement(
      null,
      'div',
      ['chart-container'],
      '',
    );

    this.controlPanelComponent.addControlPanel(this.chartContainer);

    const charDataToShow = this.getDailyData('cases');

    if (charDataToShow) {
      this.chartContainer.append(this.generateChart(charDataToShow));
    }

    const chartNavigation = addElement(
      this.chartContainer,
      'div',
      ['chart-navigation'],
      '',
    );

    addButton(
      chartNavigation,
      ['button'],
      `<span class='material-icons'>
      arrow_left
      </span>`,
      () => this.changeActiveStatisticsCategory(this.activeStatisticsCategory - 1),
    );

    this.chartInfoPanel = addElement(
      chartNavigation,
      'span',
      ['chart-navigation__info'],
      this.statisticsCategories[this.activeStatisticsCategory],
    );

    addButton(
      chartNavigation,
      ['button'],
      `<span class='material-icons'>
      arrow_right
      </span>`,
      () => this.changeActiveStatisticsCategory(this.activeStatisticsCategory + 1),
    );

    this.errorMessage = addElement(
      this.chartContainer,
      'div',
      ['error-message'],
      'There is no data to show. Please, try later',
    );

    return this.chartContainer;
  }

  onChangeStatisticsCategory() {
    this.changeChartInfoText();
    this.updateChart(this.getDataToShow());
  }

  changeChartInfoText() {
    const extraText = this.isAbsoluteData ? '' : 'per 100,000 population';
    this.chartInfoPanel.innerText = `${this.statisticsCategories[this.activeStatisticsCategory]} ${extraText}`;
  }

  changeActiveStatisticsCategory(categoryNumber) {
    let nextCategoryNumber = categoryNumber;
    if (nextCategoryNumber < 0) {
      nextCategoryNumber = 0;
      return;
    }
    if (nextCategoryNumber > this.statisticsCategories.length - 1) {
      nextCategoryNumber = this.statisticsCategories.length - 1;
      return;
    }
    this.activeStatisticsCategory = nextCategoryNumber;
    this.onChangeStatisticsCategory();
  }

  updateChartData(chartData) {
    this.chartData = chartData;
  }

  updateChartByActiveCountry(chartData) {
    this.updateChartData(chartData);
    this.updateChart(this.getDataToShow());
  }

  showErrorMessage() {
    this.chartContainer.classList.add('error');
  }

  changePeriodMode(isTotal) {
    this.isTotal = isTotal;
    this.changeChartType();
    this.updateChart(this.getDataToShow());
  }

  changeDataTypeMode(isAbsoluteData) {
    this.isAbsoluteData = isAbsoluteData;
    this.changeChartInfoText();
    this.updateChart(this.getDataToShow());
  }

  changeChartType() {
    this.chart.destroy();
    const chartCanvas = this.chartContainer.querySelector('.chart-canvas');
    const chartType = this.isTotal ? 'line' : 'bar';
    this.chart = new Chart(chartCanvas, this.generateChartConfig(chartType, null));
  }

  updateChart(chartData) {
    if (!chartData) {
      this.showErrorMessage();
      return;
    }
    if (chartData && this.chartContainer.classList.contains('error')) {
      this.chartContainer.classList.remove('error');
    }
    this.chart.data.datasets[0].data = chartData;
    this.chart.update({
      duration: 300,
      easing: 'linear',
    });
  }

  getDataToShow() {
    let charDataToShow = [];
    switch (this.statisticsCategories[this.activeStatisticsCategory]) {
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
    try {
      let prevItem = 0;
      return Object.entries(this.chartData[parameter]).map((item) => {
        const [date, quantity] = item;
        const quantityToCalc = this.isTotal ? quantity : quantity - prevItem;
        const resultQuantity = this.isAbsoluteData
          ? quantityToCalc
          : ((quantityToCalc / this.population) * 100000).toFixed(3);
        const itemData = { x: new Date(date), y: resultQuantity };
        prevItem = quantity;
        return itemData;
      });
    } catch (err) {
      this.showErrorMessage();
      return null;
    }
  }

  generateChart(charDataToShow) {
    const chartCanvas = document.createElement('canvas');
    chartCanvas.classList.add('chart-canvas');
    chartCanvas.getContext('2d');
    this.chart = new Chart(chartCanvas, this.generateChartConfig('line', charDataToShow));
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
    if (this.isTotal) {
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
              // stepSize: 200000,
              fontColor: this.chartStyles.ticksColor,
              callback: (value) => {
                const ranges = [
                  { divider: 1e6, suffix: 'M' },
                  { divider: 1e3, suffix: 'k' },
                ];
                function formatNumber(n) {
                  for (let i = 0; i < ranges.length; i += 1) {
                    if (Math.abs(n) >= ranges[i].divider) {
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
