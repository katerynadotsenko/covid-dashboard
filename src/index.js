// eslint-disable-next-line import/extensions
import App from './components/app.js';
import Keyboard from './components/virtual-keyboard.js';

window.onload = async () => {
  const app = new App();
  await app.init();
  Keyboard();
};
