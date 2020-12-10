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

export { getDataWorldByDate };
