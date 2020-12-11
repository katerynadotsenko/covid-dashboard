/* eslint-disable import/extensions */

async function getWorldDataByLastDays(dayQuantity = 'all') {
  try {
    const res = await fetch(`https://disease.sh/v3/covid-19/historical/all?lastdays=${dayQuantity}`);
    if (res.status === 200) {
      return res.json();
    }
    return res;
  } catch (err) {
    return err;
  }
}

async function getCountryDataByLastDays(country, dayQuantity = 'all') {
  try {
    const res = await fetch(`https://disease.sh/v3/covid-19/historical/${country}?lastdays=${dayQuantity}`);
    if (res.status === 200) {
      return res.json();
    }
    return res;
  } catch (err) {
    return err;
  }
}

export { getWorldDataByLastDays, getCountryDataByLastDays };
