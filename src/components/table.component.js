import ControlPanelComponent from './control-panel.component.js';
import { addElement } from '../helpers/utils.js';

export default class TableComponent {
  constructor(changeAppPeriodMode, changeAppDataTypeMode) {
    this.changeAppPeriodMode = changeAppPeriodMode;
    this.changeAppDataTypeMode = changeAppDataTypeMode;
    this.controlPanelComponent = new ControlPanelComponent(
      this.changeAppPeriodMode, this.changeAppDataTypeMode,
    );
    this.tableContainer = '';
    this.cases = '';
    this.recoveries = '';
    this.deaths = '';
    this.isTotal = true;
    this.isAbsoluteData = true;
    this.tableData = null;
    this.isWorld = true;
    this.population = 7800000000; // TODO get world population
  }

  render(getSummary) {
    this.tableData = getSummary;

    this.tableContainer = addElement(
      null,
      'div',
      ['table-container'],
      '',
    );

    this.controlPanelComponent.addControlPanel(this.tableContainer);

    this.statistics = addElement(
      this.tableContainer,
      'div',
      ['statistics'],
      '',
    );

    this.bottom = addElement(
      this.tableContainer,
      'div',
      ['bottom'],
      '',
    );

    if (getSummary.Global) {
      this.cases = addElement(
        this.statistics,
        'div',
        ['statistics__item'],
        `<span>Cases</span><span id="cases">${getSummary.Global.TotalConfirmed}</span>`,
      );

      this.recoveries = addElement(
        this.statistics,
        'div',
        ['statistics__item'],
        `<span>Recoveries</span><span id="recoveries">${getSummary.Global.TotalRecovered}</span>`,
      );

      this.deaths = addElement(
        this.statistics,
        'div',
        ['statistics__item'],
        `<span>Deaths</span><span id="deaths">${getSummary.Global.TotalDeaths}</span>`,
      );
    }

    return this.tableContainer;
  }

  updateTableData(data) {
    this.tableData = data;
  }

  updateTableByActiveCountry(data, population) {
    console.log(data);
    console.log(population);
    if (population) {
      this.population = population;
    }
    this.isWorld = false;
    if (data) {
      this.updateTableData(data);
    }
    let cases;
    let recoveries;
    let deaths;
    const lastCases = Object.values(this.tableData.cases)[Object.values(this.tableData.cases).length - 1];
    const lastRecoveries = Object.values(this.tableData.recovered)[Object.values(this.tableData.cases).length - 1];
    const lastDeaths = Object.values(this.tableData.deaths)[Object.values(this.tableData.cases).length - 1];

    if (this.isTotal) {
      cases = lastCases;
      recoveries = lastRecoveries;
      deaths = lastDeaths;
    } else {
      cases = lastCases - Object.values(this.tableData.cases)[Object.values(this.tableData.cases).length - 2];
      recoveries = lastRecoveries - Object.values(this.tableData.recovered)[Object.values(this.tableData.cases).length - 2];
      deaths = lastDeaths - Object.values(this.tableData.deaths)[Object.values(this.tableData.cases).length - 2];
    }

    this.cases.querySelector('#cases').innerText = this.isAbsoluteData ? cases : ((cases / this.population) * 100000).toFixed(3);
    this.recoveries.querySelector('#recoveries').innerText = this.isAbsoluteData ? recoveries : ((recoveries / this.population) * 100000).toFixed(3);
    this.deaths.querySelector('#deaths').innerText = this.isAbsoluteData ? deaths : ((deaths / this.population) * 100000).toFixed(3);
  }

  updateTableByWorldData() {
    let cases;
    let recoveries;
    let deaths;
    if (this.isTotal) {
      cases = this.tableData.Global.TotalConfirmed;
      recoveries = this.tableData.Global.TotalRecovered;
      deaths = this.tableData.Global.TotalDeaths;
    } else {
      cases = this.tableData.Global.NewConfirmed;
      recoveries = this.tableData.Global.NewRecovered;
      deaths = this.tableData.Global.NewDeaths;
    }
    this.cases.querySelector('#cases').innerText = this.isAbsoluteData ? cases : ((cases / this.population) * 100000).toFixed(3);
    this.recoveries.querySelector('#recoveries').innerText = this.isAbsoluteData ? recoveries : ((recoveries / this.population) * 100000).toFixed(3);
    this.deaths.querySelector('#deaths').innerText = this.isAbsoluteData ? deaths : ((deaths / this.population) * 100000).toFixed(3);
  }

  changePeriodMode(isTotal) {
    this.isTotal = isTotal;
    if (this.isWorld) {
      this.updateTableByWorldData();
    } else {
      this.updateTableByActiveCountry();
    }
  }

  changeDataTypeMode(isAbsoluteData) {
    this.isAbsoluteData = isAbsoluteData;
    if (this.isWorld) {
      this.updateTableByWorldData();
    } else {
      this.updateTableByActiveCountry();
    }
  }
}
