/* eslint-disable import/extensions */
import { normalizeDate } from './helpers/utils.js';

async function getDataWorldByDate(startDate, endDate) {
  try {
    const normalizedStartDate = normalizeDate(startDate);
    const normalizedEndDate = normalizeDate(endDate);

    const res = await fetch(`https://api.covid19api.com/world?from=${normalizedStartDate}T00:00:00Z&to=${normalizedEndDate}T00:00:00Z`);
    if (res.status === 200) {
      const data = await res.json();
      return data.sort((a, b) => a.TotalDeaths - b.TotalDeaths);
    }
    return res;
  } catch (err) {
    return err;
  }
}

async function getSummary() {
  try {
    const summary = await (await fetch('https://api.covid19api.com/summary')).json();
    const flags = await (await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code')).json();
    summary.Countries.forEach((c, idx) => {
      const flagResult = flags.find(i => i.alpha2Code === c.CountryCode);
      if (flagResult) {
        c.flag = flagResult.flag;
        c.population = flagResult.population;
      }
      else {
        delete summary.Countries[idx];
      }
    });
    return summary;
  } catch (err) {
    return err;
  }
}

export { getDataWorldByDate, getSummary };
