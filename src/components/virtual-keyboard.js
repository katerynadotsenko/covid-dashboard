const mp = { 
  "1": "!", "!": "1",
  "2": "@", "@": "2",
  "3": "#", "#": "3",
  "4": "$", "$": "4",
  "5": "%", "%": "5",
  "6": "^", "^": "6",
  "7": "&", "&": "7",
  "8": "*", "*": "8",
  "9": "(", "(": "9",
  "0": ")", ")": "0",
  ",": "<", "<": ",",
  ".": ">", ">": ".",
  "/": "?", "?": "/"
};

const keyLayouts = [
  [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
    "caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", "enter",
    "Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/","en",
    "done", "space", "<-", "->",
  ],
  [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "backspace",
    "й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ",
    "caps", "ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э", "enter",
    "Shift", "я", "ч", "с", "м", "и", "т", "ь", "б", "ю", ".","ru", 
    "done", "space", "<-", "->",
  ]
];


function spliceString(stringToInsert="") {
  let count = 0;
  if(Keyboard.properties.selectionEnd !== Keyboard.properties.selectionStart) count = Keyboard.properties.selectionEnd - Keyboard.properties.selectionStart;
  else if (!stringToInsert){
    count = 1;
    if(Keyboard.properties.selectionStart) Keyboard.properties.selectionStart--;
    else count = 0;
  }

  Keyboard.properties.value = 
    Keyboard.properties.value.slice(0, Keyboard.properties.selectionStart) + 
    stringToInsert + 
    Keyboard.properties.value.slice(Keyboard.properties.selectionStart + count);
  Keyboard.properties.selectionStart += stringToInsert.length;
  Keyboard.properties.selectionEnd = Keyboard.properties.selectionStart;
}

function addListenerMulti(el, s, fn) {
  s.split(' ').forEach(e => el.addEventListener(e, fn, false));
}

function play(code){
  document.querySelectorAll(".use-keyboard-input").forEach(element => {
    element.blur();
    // element.focus();
  });
}

const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: []
  },

  eventHandlers: {
    oninput: null,
    onclose: null
  },

  properties: {
    lang: "",
    value: "",
    capsLock: false,
    shift: false,
    mic: false,
    selectionStart: 0,
    selectionEnd: 0,
    recognizer: null
  },

  init(lang) {
    this.properties.lang = lang || "en";
    this.properties.capsLock = false;
    this.properties.shift = false;
    this.main = null;
    this.keysContainer = null;
    this.keys = [];

    // Create main elements
    this.elements.main = document.createElement("div");
    this.elements.keysContainer = document.createElement("div");

    // Setup main elements
    this.elements.main.classList.add("keyboard", "keyboard--hidden");
    this.elements.keysContainer.classList.add("keyboard__keys");
    this.elements.keysContainer.appendChild(this._createKeys(this.properties.lang));

    this.elements.keys = this.elements.keysContainer.querySelectorAll(".keyboard__key");

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.removeChild(document.body.lastChild);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    //document.querySelector(".use-keyboard-input").focus();
    if(!lang){
    document.querySelectorAll(".use-keyboard-input").forEach(element => {
        var down = false;

        element.addEventListener("keydown", e => {
          if(e.getModifierState && e.getModifierState('CapsLock')){
            this.properties.capsLock = true;
            for (const key of this.elements.keys) {
              if (key.childElementCount === 0 && !(["Shift", "en", "ru"].includes(key.textContent))) {
                key.textContent = (this.properties.capsLock ^ this.properties.shift) ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
              }
            }
            [...document.querySelectorAll("button i")].filter(a => a.textContent === 'keyboard_capslock')[0].parentElement.classList.add("keyboard__key--active");
          } 

          let code = e.code;
          if(e.code.slice(0, 3) === "Key") code = e.code.slice(3);
          else if(e.code.slice(0, 5) === "Digit") code = e.code.slice(5);
          else if(code === 'Comma') code = ',';
          else if(code === 'Period') code = '.';
          else if(code === 'Slash') code = '/';
          else if(code === 'Backspace') code = 'backspace';
          else if(code === 'CapsLock') code = 'keyboard_capslock';
          else if(code === 'Enter') code = 'keyboard_return';
          else if(code === 'Space') code = 'space_bar';
          else if(code === 'ArrowLeft') code = 'keyboard_arrow_left';
          else if(code === 'ArrowRight') code = 'keyboard_arrow_right';
          else if(code === 'ShiftRight' || code === 'ShiftLeft') code = 'Shift';
          [...document.querySelectorAll("button")].filter(a => a.textContent.toLowerCase() === e.key.toLowerCase() || a.textContent.toLowerCase() === code.toLowerCase())
            .forEach(a => {
              if(!(code === 'Shift' || code === 'keyboard_capslock')){
                setTimeout(() => a.classList.toggle('active'), 0);
                setTimeout(() => a.classList.toggle('active'), 100);
              }
            });
        });

        element.addEventListener("keydown", e => {
          if(down) return;
          down = true;
          let code = e.code;
          if(code === 'ShiftRight' || code === 'ShiftLeft') code = 'Shift';
          [...document.querySelectorAll("button")].filter(a => a.textContent.toLowerCase() === code.toLowerCase())
            .forEach(a => {
              if(code === 'Shift') {this._toggleShift(); a.classList.add("keyboard__key--active", this.properties.shift);}
            });

          [...document.querySelectorAll("button i")].filter(a => a.textContent === 'keyboard_capslock')
          .forEach(a => {
            if(code === 'CapsLock') {
              if(!(e.getModifierState && e.getModifierState('CapsLock'))){
                this._toggleCapsLock(); a.parentElement.classList.remove("keyboard__key--active");
              }
            }
          });
        });

        element.addEventListener("keyup", e => {
          e.target.blur();
          e.target.focus();
          if(!down) return;
          down = false;
          let code = e.code;
          if(code === 'ShiftRight' || code === 'ShiftLeft') code = 'Shift';
          [...document.querySelectorAll("button")].filter(a => a.textContent.toLowerCase() === code.toLowerCase())
            .forEach(a => {
              if(code === 'Shift') {this._toggleShift(); a.classList.remove("keyboard__key--active", this.properties.shift);}
            });
        });


        addListenerMulti(element, "focus input click", () => {
          this.properties.selectionStart = element.selectionStart; 
          this.properties.selectionEnd = element.selectionEnd;
          this.properties.value = element.value;
          this.open(element.value, currentValue => {
            element.value = currentValue;
            element.selectionStart = this.properties.selectionStart;
            element.selectionEnd = this.properties.selectionEnd;
            element.focus();
          });
        });
      });
    }
  },

  _createKeys(lang) {
    const fragment = document.createDocumentFragment();
    let keyLayout = lang === 'en' ? keyLayouts[0] : keyLayouts[1];

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class="material-icons">${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const keyElement = document.createElement("button");
      const insertLineBreak = ["backspace", "p", "enter", "?", "ъ", "en", "ru"].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute("type", "button");
      keyElement.classList.add("keyboard__key");

      switch (key) {
        case "backspace":
          keyElement.addEventListener("click", () => play("backspace"));
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("backspace");

          keyElement.addEventListener("click", () => {
            let start = this.properties.selectionStart;
            spliceString();
            this._triggerEvent("oninput");
          });

          break;

        case "caps":
          keyElement.addEventListener("click", () => play("capsLock"));
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable");
          keyElement.innerHTML = createIconHTML("keyboard_capslock");

          keyElement.addEventListener("click", () => {
            this._toggleCapsLock();
            keyElement.classList.toggle("keyboard__key--active", this.properties.capsLock);
            this._triggerEvent("oninput");
          });

          break;

        case "enter":
          keyElement.addEventListener("click", () => play("enter"));
          keyElement.classList.add("keyboard__key--wide");
          keyElement.innerHTML = createIconHTML("keyboard_return");

          keyElement.addEventListener("click", () => {
            spliceString("\n");
            this._triggerEvent("oninput");
          });

          break;

        case "space":
          keyElement.addEventListener("click", () => play("space"));
          keyElement.classList.add("keyboard__key--extra-wide");
          keyElement.innerHTML = createIconHTML("space_bar");

          keyElement.addEventListener("click", () => {
            spliceString(" ");
            this._triggerEvent("oninput");
          });

          break;

        case "done":
          keyElement.addEventListener("click", () => play("done"));
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--dark");
          keyElement.innerHTML = createIconHTML("check_circle");

          keyElement.addEventListener("click", () => {
            this.close();
            this._triggerEvent("onclose");
          });

          break;

        case "Shift":
          keyElement.addEventListener("click", () => play("shift"));
          keyElement.textContent = "Shift";
          keyElement.classList.add("keyboard__key--wide", "keyboard__key--activatable")

          keyElement.addEventListener("click", () => {
            this._toggleShift();
            keyElement.classList.toggle("keyboard__key--active", this.properties.shift);
            this._triggerEvent("oninput");
          });

          break;

        case "en":
          keyElement.addEventListener("click", () => play("lang"));
          keyElement.textContent = "en";
          keyElement.classList.add("keyboard__key--wide")

          keyElement.addEventListener("click", () => {
            Keyboard.init('ru');
            Keyboard.elements.main.classList.remove("keyboard--hidden");
          });
          
          break;

        case "ru":
          keyElement.addEventListener("click", () => play("lang"));
          keyElement.textContent = "ru";
          keyElement.classList.add("keyboard__key--wide")

          keyElement.addEventListener("click", () => {
            Keyboard.init('en');
            Keyboard.elements.main.classList.remove("keyboard--hidden");
          });

          break;

        case "<-":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_left");
          keyElement.classList.add("keyboard__key--dark");
          keyElement.addEventListener("click", () => play("lang"));
          keyElement.addEventListener("click", () => {
            this.properties.selectionEnd = this.properties.selectionStart === 0 ? this.properties.selectionStart : --this.properties.selectionStart;
            this._triggerEvent("oninput");
          });

          break;

        case "->":
          keyElement.innerHTML = createIconHTML("keyboard_arrow_right");
          keyElement.classList.add("keyboard__key--dark");
          keyElement.addEventListener("click", () => play("lang"));
          keyElement.addEventListener("click", () => {
            this.properties.selectionEnd = ++this.properties.selectionStart;
            this._triggerEvent("oninput");
          });

          break;

        default:
          keyElement.addEventListener("click", () => play(this.properties.lang));
          keyElement.textContent = key.toLowerCase();

          keyElement.addEventListener("click", () => {
            let res = (this.properties.capsLock ^ this.properties.shift) ? key.toUpperCase() : key.toLowerCase();
            if(key in mp && this.properties.shift) res = mp[key];
            
            spliceString(res);
            
            this._triggerEvent("oninput");
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement("br"));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == "function") {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !(["Shift", "en", "ru"].includes(key.textContent))) {
        key.textContent = (this.properties.capsLock ^ this.properties.shift) ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleMic(lang) {
    this.properties.mic = !this.properties.mic;
    if(this.properties.recognizer === null){
      window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.properties.recognizer = new webkitSpeechRecognition();

      this.properties.recognizer.interimResults = true;
      var buff = "(wtf)";
      
      this.properties.recognizer.addEventListener('result', e => {
        const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        Keyboard.properties.value = buff + transcript;
        this._triggerEvent("oninput");
      });

    }

    var handler = () => {
      if(!this.properties.value) buff = " ";
      else buff = this.properties.value;
      this.properties.recognizer.start();
    }

    if(this.properties.mic){
      this.properties.recognizer.lang = lang;
      this.properties.recognizer.addEventListener('end', handler);
      handler();
    }
    else{
      this.properties.recognizer.removeEventListener('end', handler);
      this.properties.recognizer = null;
    }
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && !(["Shift", "en", "ru"].includes(key.textContent))) {
        key.textContent = (this.properties.capsLock ^ this.properties.shift) ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
        if(key.textContent in mp) key.textContent = mp[key.textContent];
      }
    }
  },

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove("keyboard--hidden");
  },

  close() {
    this.properties.value = "";
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add("keyboard--hidden");
  }
};

export default function () {
  document.body.appendChild(document.createElement("div"));
  Keyboard.init();
};