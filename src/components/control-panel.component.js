function addSwitch(parentNode, id, textFirst = '', textSecond = '', onChange) {
  const switchElement = document.createElement('label');
  switchElement.classList.add('switch');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('id', id);
  const switchSlider = document.createElement('span');
  switchSlider.classList.add('switch__slider');
  switchSlider.setAttribute('id', `switch__slider-${id}`);
  switchSlider.innerText = textFirst;
  switchElement.append(checkbox);
  switchElement.append(switchSlider);

  switchElement.addEventListener('change', (e) => {
    onChange(!e.target.checked);
    const controlPanels = document.querySelectorAll(`.control-panel #${e.target.id}`);
    const switchSliders = document.querySelectorAll(`.control-panel #switch__slider-${e.target.id}`);
    controlPanels.forEach((item) => {
      item.checked = e.target.checked;
    });
    if (e.target.checked) {
      switchSliders.forEach((item) => {
        item.innerText = textSecond;
      });
    } else {
      switchSliders.forEach((item) => {
        item.innerText = textFirst;
      });
    }
  });
  if (parentNode) {
    parentNode.append(switchElement);
  }
  return switchElement;
}

export default class ControlPanelComponent {
  constructor(changePeriodMode, changeDataTypeMode) {
    this.isTotal = true;
    this.changePeriodMode = changePeriodMode;
    this.changeDataTypeMode = changeDataTypeMode;
  }

  onChangePeriodSwitch(isTotal) {
    this.isTotal = isTotal;
    this.changePeriodMode(isTotal);
  }

  onChangeDataTypeSwitch(isAbsoluteData) {
    this.isAbsoluteData = isAbsoluteData;
    this.changeDataTypeMode(isAbsoluteData);
  }

  addControlPanel(parentNode) {
    const controlPanel = document.createElement('div');
    controlPanel.classList.add('control-panel');
    const switchPeriodElement = addSwitch(controlPanel, 'period', 'Total', 'Last Day', (isTotal) => this.onChangePeriodSwitch(isTotal));
    const switchDataTypeElement = addSwitch(controlPanel, 'type', 'Absolute', 'Per 100k', (isAbsoluteData) => this.onChangeDataTypeSwitch(isAbsoluteData));
    controlPanel.append(switchPeriodElement);
    controlPanel.append(switchDataTypeElement);
    if (parentNode) {
      parentNode.append(controlPanel);
    }
    return controlPanel;
  }
}
