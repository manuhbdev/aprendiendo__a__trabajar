import { sendEventUpdateUI } from '../utils/appEvents.js';
import { dragElement } from '../utils/draggable.js';
import { createName } from '../utils/utils.js';
import { setWindowName } from './state.js';

export const APP_STATES = {
  OPEN: 'open',
  CLOSED: 'close',
  MIN: 'min',
};

export const RESOURCE_TYPES = {
  ASSET: 'ASSET',
  FILE: 'FILE',
  FOLDER: 'FOLDER',
};
class App {
  constructor({ id, name, className, type = 'app', content, icon }) {
    this.id = `${type}__${name}__${id}`.toLocaleLowerCase();
    this.name = name;
    this.className = className;
    this.icon = icon;
    this.content = content;
    this.type = type;
    this.state = 'close';
    this.HTMLContent = '';
  }
  renderContent() {}
}
export class Window {
  constructor({ id, name, icon, app }) {
    this.state = APP_STATES.CLOSED;
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.app = app;
    this.isActive = false;
    this.windowHTML = this.getHTML();
  }

  getHTML() {
    const windowDIV = document.createElement('div');
    windowDIV.classList.add('window');
    windowDIV.classList.add(APP_STATES.CLOSED);
    windowDIV.innerHTML = `
    <div class="window__header">
    <div class="name">
        <img width="16px" src="/img/icons/${this.icon}"/>
        <p class="app-name">${this.name}</p>
    </div>

     <div class="window__controls">
        <div class="control min">-</div>
        <div class="control close">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
        </div>
     </div>
    </div>
    <div class="window__content"></div>
    <div class="window__footer">

    </div>
    `;
    windowDIV.style.top = `${Math.random() * 15 + 100}px`;
    windowDIV.style.left = `${Math.random() * 100 + 100}px`;

    dragElement(windowDIV, '.window__header .name');
    //
    const minControl = windowDIV.querySelector('.window__controls .min');
    minControl.onclick = () => this.minimize(windowDIV);
    //
    const closeControl = windowDIV.querySelector('.window__controls .close');
    closeControl.onclick = () => this.close(windowDIV);

    return windowDIV;
  }
  open() {
    this.state = APP_STATES.OPEN;
    this.isActive = true;
    this.windowHTML.classList.add('open');
    this.windowHTML.classList.remove('min');
    this.windowHTML.classList.remove('active');
    this.windowHTML.classList.remove('close');
    // this.redraw();
  }
  minimize(windowHTML) {
    this.state = APP_STATES.MIN;
    this.isActive = false;
    windowHTML.classList.add('min');
    windowHTML.classList.remove('open');
    windowHTML.classList.remove('active');
    windowHTML.classList.remove('close');
    this.redraw();
  }
  close(windowHTML) {
    this.state = APP_STATES.CLOSED;
    this.isActive = false;
    windowHTML.classList.add('close');
    windowHTML.classList.remove('open');
    windowHTML.classList.remove('active');
    windowHTML.classList.remove('min');
    this.redraw();
  }
  redraw() {
    setTimeout(() => {
      sendEventUpdateUI();
    }, 300);
  }
}
export class DesktopIcon {
  constructor({ id, icon, name, app }) {
    this.id = id;
    this.icon = icon;
    this.name = name;
    this.app = app;
  }
  getHTML() {
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('icon');

    const isFile = this.app.type === RESOURCE_TYPES.FILE;
    const isFolder = this.app.type === RESOURCE_TYPES.FOLDER;
    const isEditable = isFile || isFolder;
    if (isEditable) {
      iconDiv.innerHTML = `
      <img width="32px" src="/img/icons/${this.icon}"/>
      <p class="name" spellcheck="false"  contenteditable="true" ondrop="return false;"  >${this.name}</p>
    `;
      const resourceName = iconDiv.querySelector('.name');
      resourceName.addEventListener('blur', (event) => {
        const newName = event.target.firstChild?.data || '';
        const cleanName = newName.replace(/\s/g, '');
        const validName = cleanName !== '';
        if (!validName) {
          event.target.innerHTML = '';
          event.target.innerText = this.name;
          return;
        }
        //
        this.name = createName(cleanName, this.app.type);
        setWindowName(this.app.id, cleanName);
        // updateUI
        sendEventUpdateUI();
      });
    } else {
      iconDiv.innerHTML = `
      <img width="32px" src="/img/icons/${this.icon}"/>
      <p class="name">${this.name}</p>
    `;
    }

    return iconDiv;
  }
}
export class Papelera extends App {
  constructor(shape) {
    shape.type = 'app';
    super(shape);
  }
  renderContent(targetHTMLElement) {
    const containerDIV = document.createElement('div');
    containerDIV.classList.add('file-list');
    this.content.forEach((file) => {
      //
      const divFile = document.createElement('div');
      divFile.classList.add('file');
      const fileIcon = document.createElement('img');
      fileIcon.width = 32;

      fileIcon.src = `/img/icons/${file.icon}`;
      const fileName = document.createElement('p');
      fileName.innerText = `${file.name}.${file.type}`;
      divFile.appendChild(fileIcon);
      divFile.appendChild(fileName);

      containerDIV.appendChild(divFile);
    });
    targetHTMLElement.appendChild(containerDIV);
  }
}
export class Folder extends App {
  constructor(shape) {
    shape.type = RESOURCE_TYPES.FOLDER;
    super(shape);
  }
  renderContent(targetHTMLElement) {
    const containerDIV = document.createElement('div');
    containerDIV.classList.add('file-list');
    this.content.forEach((file) => {
      //
      const divFile = document.createElement('div');
      divFile.classList.add('file');
      const fileIcon = document.createElement('img');
      fileIcon.width = 32;

      fileIcon.src = `/img/icons/${file.icon}`;
      const fileName = document.createElement('p');
      fileName.innerText = `${file.name}.${file.type}`;
      divFile.appendChild(fileIcon);
      divFile.appendChild(fileName);

      containerDIV.appendChild(divFile);
    });
    targetHTMLElement.appendChild(containerDIV);
  }
}
export class File extends App {
  constructor(shape) {
    shape.type = RESOURCE_TYPES.FILE;
    super(shape);
  }
  renderContent(targetHTMLElement) {
    const textArea = document.createElement('div');
    textArea.setAttribute('contenteditable', true);
    textArea.setAttribute('autofocus', true);
    textArea.ondrop = () => {
      return false;
    };
    textArea.style.width = `${100}%`;
    textArea.style.height = `${100}%`;
    //
    targetHTMLElement.appendChild(textArea);
  }
}
export class Notes extends App {
  constructor(shape) {
    shape.name = 'notes';
    shape.icon = 'notepad.svg';
    super(shape);
  }
  renderContent(targetHTMLElement) {
    const textArea = document.createElement('div');
    textArea.classList.add('editor');
    textArea.setAttribute('contenteditable', true);
    textArea.setAttribute('autofocus', true);
    textArea.ondrop = () => {
      return false;
    };
    textArea.style.width = `${100}%`;
    textArea.style.height = `${100}%`;
    textArea.innerHTML = 'Untitled Note';
    //
    targetHTMLElement.appendChild(textArea);
  }
}
//
export class Terminal extends App {
  constructor(shape, shell) {
    shape.name = 'terminal';
    shape.icon = 'terminal.svg';
    super(shape);
    this.shell = shell;
  }
  renderContent(targetHTMLElement) {
    // template
    const terminal_div = document.createElement('div');
    const terminal_HTML = `
    <div id="terminal_${this.id}" class="terminal">
      <div id="terminal__output" class="terminal_output"></div>
      <div class="input-bar">
        <label
          for="terminal__input"
          id="terminal__input-label"
          class="unselectable"
          ></label
        >
        <input type="text" id="terminal__input" />
      </div>
    </div>
    `;
    terminal_div.innerHTML = terminal_HTML;
    // input_label
    const input_label = terminal_div.querySelector(`#terminal__input-label`);
    // input
    const input_control = terminal_div.querySelector(`#terminal__input`);
    input_control.addEventListener('keyup', (event) => {
      const isEnter = event.key === 'Enter';
      if (isEnter) {
        const user_input = event.target;
        this.shell.read(user_input.value);
      }
    });
    // output
    const output = terminal_div.querySelector(`#terminal__output`);
    // connecting UI to shell
    this.shell.container_HTML = targetHTMLElement;
    this.shell.input_HTML = input_control;
    this.shell.input_label_HTML = input_label;
    this.shell.output_HTML = output;
    this.shell.update_label();
    // inject in window
    targetHTMLElement.appendChild(terminal_div);
  }
}
