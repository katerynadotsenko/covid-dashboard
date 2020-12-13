function normalizeDate(date) {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}

function appendChildren(parent, children) {
  parent.innerHTML = '';
  children.sort((a, b) => parseFloat(b.innerText) - parseFloat(a.innerText));
  children.forEach((c) => parent.appendChild(c));
  return parent;
}

export { normalizeDate, appendChildren };
