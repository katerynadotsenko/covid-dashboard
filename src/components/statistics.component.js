/* eslint-disable import/extensions */
import { appendChildren } from '../helpers/utils.js';
import app from './app.js';
import state from '../helpers/state.js';

export default class StatisticsComponent {
    constructor() {
        this.statuses = ['Confirmed', 'Deaths', 'Recovered'];
        this.status = this.statuses.indexOf(state.status);

        this.whenList = ['New', 'Total'];
        this.when = this.whenList.indexOf(state.when);

        this.howList = ['Raw', 'Per 100k'];
        this.how = this.howList.indexOf(state.how);
    }

    refresh(countries) {
        this.countriesElements = {};
        countries.forEach(c => {
            const countryElement = document.createElement('div');
            countryElement.classList.add('country');
            countryElement.id = c.CountryCode;

            const number = document.createElement('span');
            const k = this.how === 0 ? 1 : c.population / 100000;
            let text = c[`${state.when}${state.status}`]
            if(this.how === 1) {
                text = (parseFloat(text, 10) / k).toFixed(2);
            }
            number.innerText = text;
            number.classList.add('cases');
            number.classList.add('confirmed');
            countryElement.appendChild(number);

            const name = document.createElement('span');
            name.innerText = c.Country;
            name.classList.add('country_name');
            countryElement.appendChild(name);

            this.countriesElements[c.CountryCode] = countryElement;
        });
        appendChildren(this.countriesContainer, Object.values(this.countriesElements));
    }
  
    render(summary) {
      const countries = summary.Countries;
      const tableWrapper = document.createElement('div');
      tableWrapper.classList.add('statistics_wrapper');
     
      const statusContainer = document.createElement('div');
      const statusButtonL = document.createElement('button');
      const statusButtonR = document.createElement('button');
      statusButtonL.classList.add('button-arrow');
      const statusImgL = document.createElement('img');
      statusImgL.src = "../assets/arrow-left.svg";
      statusButtonL.appendChild(statusImgL);
      statusButtonL.onclick = () => {
        if(this.status > 0) this.status--;
        else this.status = this.statuses.length - 1;
        const curStat = this.statuses[this.status];
        statusSpan.innerText = curStat;
        state.status = curStat;
        this.refresh(countries)
      }

      const statusSpan = document.createElement('span');
      statusSpan.innerText = state.status;

      statusButtonR.classList.add('button-arrow');
      const statusImgR = document.createElement('img');
      statusImgR.src = "../assets/arrow-right.svg";
      statusButtonR.appendChild(statusImgR);
      statusButtonR.onclick = () => {
        if(this.status < this.statuses.length - 1) this.status++;
        else this.status = 0;
        const curStat = this.statuses[this.status];
        statusSpan.innerText = curStat;
        state.status = curStat;
        this.refresh(countries)
      }
      statusContainer.appendChild(statusButtonL);
      statusContainer.appendChild(statusSpan);
      statusContainer.appendChild(statusButtonR);


      const whenContainer = document.createElement('div');
      const whenButtonL = document.createElement('button');
      const whenButtonR = document.createElement('button');
      whenButtonL.classList.add('button-arrow');
      const whenImgL = document.createElement('img');
      whenImgL.src = "../assets/arrow-left.svg";
      whenButtonL.appendChild(whenImgL);
      whenButtonL.onclick = () => {
        if(this.when > 0) this.when--;
        else this.when = this.whenList.length - 1;
        const curWhen = this.whenList[this.when];
        whenSpan.innerText = curWhen;
        state.when = curWhen;
        this.refresh(countries)
      }

      const whenSpan = document.createElement('span');
      whenSpan.innerText = state.when;

      whenButtonR.classList.add('button-arrow');
      const whenImgR = document.createElement('img');
      whenImgR.src = "../assets/arrow-right.svg";
      whenButtonR.appendChild(whenImgR);
      whenButtonR.onclick = () => {
        if(this.when < this.whenList.length - 1) this.when++;
        else this.when = 0;
        const curWhen = this.whenList[this.when];
        whenSpan.innerText = curWhen;
        state.when = curWhen;
        this.refresh(countries)
      }
      whenContainer.appendChild(whenButtonL);
      whenContainer.appendChild(whenSpan);
      whenContainer.appendChild(whenButtonR);


      const howContainer = document.createElement('div');
      const howButtonL = document.createElement('button');
      const howButtonR = document.createElement('button');
      howButtonL.classList.add('button-arrow');
      const howImgL = document.createElement('img');
      howImgL.src = "../assets/arrow-left.svg";
      howButtonL.appendChild(howImgL);
      howButtonL.onclick = () => {
        if(this.how > 0) this.how--;
        else this.how = this.howList.length - 1;
        const curHow = this.howList[this.how];
        howSpan.innerText = curHow;
        state.how = curHow;
        this.refresh(countries)
      }

      const howSpan = document.createElement('span');
      howSpan.innerText = state.how;

      howButtonR.classList.add('button-arrow');
      const howImgR = document.createElement('img');
      howImgR.src = "../assets/arrow-right.svg";
      howButtonR.appendChild(howImgR);
      howButtonR.onclick = () => {
        if(this.how < this.howList.length - 1) this.how++;
        else this.how = 0;
        const curHow = this.howList[this.how];
        howSpan.innerText = curHow;
        state.how = curHow;
        this.refresh(countries)
      }
      howContainer.appendChild(howButtonL);
      howContainer.appendChild(howSpan);
      howContainer.appendChild(howButtonR);

      const menues = document.createElement('div');
      menues.classList.add('menues')
      menues.appendChild(statusContainer);
      menues.appendChild(whenContainer);
      menues.appendChild(howContainer);
      tableWrapper.appendChild(menues);

      this.countriesContainer = document.createElement('div');
      this.countriesContainer.classList.add('countries_container');

      tableWrapper.appendChild(this.countriesContainer);
      this.refresh(countries)
      return tableWrapper;
    }
  }
  