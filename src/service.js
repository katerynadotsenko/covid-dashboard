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

async function getDataforMarkers() {
  try {
    const res = await fetch('https://disease.sh/v3/covid-19/jhucsse');
    if (res.status === 200) {
      return res.json();
    }
    return res;
  } catch (err) {
    return err;
  }
}

async function getSummary() {
  try {
    const summary = await (await fetch('https://api.covid19api.com/summary')).json();
    const flags = await (await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag;alpha2Code;alpha3Code')).json();
    summary.Countries.forEach((c, idx) => {
      const flagResult = flags.find((i) => i.alpha2Code === c.CountryCode);
      if (flagResult) {
        c.flag = flagResult.flag;
        c.population = flagResult.population;
        c.alpha3Code = flagResult.alpha3Code;
      } else {
        delete summary.Countries[idx];
      }
    });
    return summary;
  } catch (err) {
    return err;
  }
}

export { getWorldDataByLastDays, getCountryDataByLastDays, getSummary, getDataforMarkers };
