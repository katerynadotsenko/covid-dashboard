/* eslint-disable import/extensions */
/* import Chart from 'chart.js'; */
import { normalizeDate } from '../helpers/utils.js';

export default class ChartComponent {
  constructor(chartStartDate) {
    this.chartStartDate = chartStartDate;
    this.chartData = [];
    this.chartContainer = '';
  }

  render() {
    this.chartContainer = document.createElement('div');
    this.chartContainer.append(this.generateChart());

    return this.chartContainer;
  }

  setCharData(chartData) {
    this.chartData = chartData;
  }

  getChartDataForDailyCases() {
    if (!Array.isArray(this.chartData)) {
      console.log('getChartDataForDailyCases error'); // TODO
    }
    return this.chartData.map((item, i) => {
      const date = new Date(new Date(this.chartStartDate).getTime() + (i * 24 * 60 * 60 * 1000));
      return { x: date, y: item.NewConfirmed };
    });
  }

  generateChart() {
    const startDate = '2020-04-14T00:00:00Z';
    this.data = this.getChartDataForDailyCases(startDate);

    const ctx = document.createElement('canvas');
    ctx.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          data: this.data,
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
              max: 800000,
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
    return ctx;
  }
}
