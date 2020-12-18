function addSwitch(parentNode, textFirst = '', textSecond = '', onChange) {
  const switchElement = document.createElement('label');
  switchElement.classList.add('switch');
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  const switchSlider = document.createElement('span');
  switchSlider.classList.add('switch__slider');
  switchSlider.innerText = textFirst;
  switchElement.append(checkbox);
  switchElement.append(switchSlider);

  switchElement.addEventListener('change', (e) => {
    onChange(!e.target.checked);
    if (e.target.checked) {
      switchSlider.innerText = textSecond;
    } else {
      switchSlider.innerText = textFirst;
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
    const switchPeriodElement = addSwitch(controlPanel, 'Total', 'Last Day', (isTotal) => this.onChangePeriodSwitch(isTotal));
    const switchDataTypeElement = addSwitch(controlPanel, 'Absolute', 'Per 100k', (isAbsoluteData) => this.onChangeDataTypeSwitch(isAbsoluteData));
    controlPanel.append(switchPeriodElement);
    controlPanel.append(switchDataTypeElement);
    if (parentNode) {
      parentNode.append(controlPanel);
    }
    return controlPanel;
  }
}
