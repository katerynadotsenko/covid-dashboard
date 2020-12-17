function normalizeDate(date) {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}

function addButton(parentNode, classes, content, onClick) {
  const button = document.createElement('button');
  button.classList.add(...classes);
  button.innerHTML = content;
  button.addEventListener('click', onClick);
  if (parentNode) {
    parentNode.append(button);
  }
  return button;
}

function addElement(parentNode, tagName = 'div', classes, content = '') {
  const element = document.createElement(tagName);
  element.classList.add(...classes);
  element.innerHTML = content;
  element.innerHtml = content;
  if (parentNode) {
    parentNode.append(element);
  }
  return element;
}

function appendChildren(parent, children) {
  parent.innerHTML = '';
  children.sort((a, b) => parseFloat(b.innerText) - parseFloat(a.innerText));
  children.forEach((c) => parent.appendChild(c));
  return parent;
}

export {
  normalizeDate, appendChildren, addButton, addElement,
};
