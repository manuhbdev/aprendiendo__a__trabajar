/*
- declarations
- funciones
- variables
- eventos
- executions
*/
// DECLARATIONS
class Window {
  constructor() {}
  open() {}
  minimize() {}
  close() {}
}
// FUNCIONES
const showSendmenu = () => {
  secondMenuContainer.style.display = 'flex';
};
const hideSendmenu = () => {
  secondMenuContainer.style.display = 'none';
};
function dragElement(elmnt, zone) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  const dragZone = elmnt.querySelector(zone);
  if (dragZone) {
    dragZone.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
function minWindow(id) {
  const windowApp = document.getElementById(id);
  windowApp.classList.remove('open');
  windowApp.classList.add('min');
  const app = openApps.find((app) => app.name === windowApp.name);
  app.state = 'min';

  updateNavBar();
}
function maxWindow(id) {
  updateNavBar();
}
function closeWindow(id) {
  const w = document.getElementById(id);
  w.classList.add('close');
  openApps = openApps.filter((app) => app.name !== w.name);
  setTimeout(() => {
    w.remove();
    updateNavBar();
  }, 300);
}
function updateNavBar() {
  const minApps = openApps;
  const footerNav = document.getElementById('navbar');
  // console.log({ minApps });
  footerNav.innerHTML = '';

  minApps.forEach((app) => {
    const div = document.createElement('div');
    div.classList.add('min__app');
    if (activeWindow && activeWindow.name === app.name) {
      div.classList.add('active');
    }
    div.id = app.name;
    div.innerText = app.name;
    div.innerHTML = `<img width="32px" src="/img/icons/${app.src}"/>`;
    div.onclick = (e) => {
      app.state = 'open';

      const windowApp = document.getElementById(`window__${app.name}`);
      windowApp.classList.remove('min');
      windowApp.classList.add('open');
      if (activeWindow) {
        activeWindow.classList.remove('active');
      }
      activeWindow = windowApp;
      activeWindow.classList.add('active');

      updateNavBar();
    };
    footerNav.appendChild(div);
  });
}
function selectText(containerid) {
  if (document.selection) {
    // IE
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
}
function initApp() {
  /*
    - variables
    - funciones
    - events
    - executions
  */

  hideSendmenu();
  setInterval(() => {
    var date = new Date();
    const day = ('00' + date.getDate()).slice(-2);
    const month = ('00' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('00' + date.getHours()).slice(-2);
    const minutes = ('00' + date.getMinutes()).slice(-2);
    const seconds = ('00' + date.getMinutes()).slice(-2);

    time.innerText = `${hours}:${minutes}`;
  }, 1000);

  screen.addEventListener(
    'contextmenu',
    (e) => {
      e.preventDefault();

      if (
        e.target.closest('#windows-container') ||
        e.target.closest('#navbar')
      ) {
        console.warn('click on window');
        return;
      }
      showSendmenu();
      secondMenu.style.top = `${e.offsetY}px`;
      secondMenu.style.left = `${e.offsetX + 1}px`;
    },
    false
  );
  secondMenuOverlay.addEventListener('click', (e) => {
    hideSendmenu();
  });
  //

  // UI
  const iconsContainer = document.getElementById('icons');
  apps.forEach((icon) => {
    //
    const div = document.createElement('div');
    div.classList.add(icon.class);
    div.setAttribute('name', icon.name);
    div.innerText = icon.name;
    div.innerHTML = `
      <img width="32px" src="/img/icons/${icon.src}"/>
      <p class="name">${icon.name}</p>
    `;
    div.addEventListener('click', (event) => {
      const windowExist = openApps.find((app) => app.name === icon.name);

      if (windowExist && windowExist.state === 'open') {
        return;
      }
      if (windowExist && windowExist.state === 'min') {
        const windowHtml = document.getElementById(
          `window__${windowExist.name}`
        );

        windowHtml.classList.remove('min');
        windowHtml.classList.add('open');

        if (activeWindow) {
          activeWindow.classList.remove('active');
        }
        activeWindow = windowHtml;
        activeWindow.classList.add('active');
        updateNavBar();

        return;
      }

      // open window
      const windowDiv = document.createElement('div');
      windowDiv.classList.add('window');
      // windowDiv.classList.add('shadow');
      windowDiv.classList.add('open');

      if (activeWindow) {
        activeWindow.classList.remove('active');
      }

      activeWindow = windowDiv;
      activeWindow.classList.add('active');

      windowDiv.addEventListener('click', (e) => {
        if (activeWindow) {
          activeWindow.classList.remove('active');
        }

        activeWindow = windowDiv;
        activeWindow.classList.add('active');
        updateNavBar();
      });
      //

      openApps.push({ name: icon.name, state: 'open', ...icon });

      //
      windowDiv.id = `window__${icon.name}`;
      windowDiv.name = icon.name;
      windowDiv.style.top = `${Math.random() * 60 + 100}px`;
      windowDiv.style.left = `${Math.random() * 400 + 200}px`;
      windowDiv.innerHTML = `
         <div class="window__header">
          <p class="name">${icon.name}
            </p>
          <div class="window__controls"></div>
         </div>
         <div class="window__content"></div>
         <div class="window__footer"></div>
      `;

      const contentTarget = windowDiv.querySelector('.window__content');
      icon.render(contentTarget);

      const controlContainer = windowDiv.querySelector('.window__controls');

      const minControl = document.createElement('div');
      minControl.classList.add('control');
      minControl.innerText = '-';
      minControl.onclick = (event) => {
        minWindow(windowDiv.id);
      };
      const maxControl = document.createElement('div');
      maxControl.classList.add('control');
      maxControl.innerText = '[ ]';
      maxControl.onclick = (event) => {
        maxWindow(windowDiv.id);
      };
      const closeControl = document.createElement('div');
      closeControl.classList.add('control');
      closeControl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
    </svg>`;
      closeControl.onclick = (event) => {
        closeWindow(windowDiv.id);
      };
      //
      controlContainer.appendChild(minControl);
      // controlContainer.appendChild(maxControl);
      controlContainer.appendChild(closeControl);

      dragElement(windowDiv, '.window__header .name');
      updateNavBar();
      //
      // screen.appendChild(windowDiv);
      windowsContainer.appendChild(windowDiv);
    });

    //
    iconsContainer.appendChild(div);
  });
}
// VARIABLES
const apps = [
  {
    name: 'papelera',
    src: 'trash-can.svg',
    class: 'icon',
    render: (targetEl) => {
      //
      const files = [
        {
          name: 'movies__XXX',
          type: 'zip',
          icon: 'zip.svg',
        },
        {
          name: 'cv-final-final',
          type: 'docx',
          icon: 'docx.svg',
        },
      ];
      const divContainer = document.createElement('div');
      divContainer.classList.add('file-list');
      files.forEach((file) => {
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

        divContainer.appendChild(divFile);
      });
      targetEl.appendChild(divContainer);
    },
  },
  {
    name: 'documents',
    src: 'folder.svg',
    class: 'icon',
    render: (targetEl) => {
      //
      const files = [
        {
          name: 'brochure',
          type: 'zip',
          icon: 'pdf.svg',
        },
        {
          name: 'estatuto fundación',
          type: 'docx',
          icon: 'docx.svg',
        },
      ];
      const divContainer = document.createElement('div');
      divContainer.classList.add('file-list');
      files.forEach((file) => {
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

        divContainer.appendChild(divFile);
      });
      targetEl.appendChild(divContainer);
    },
  },
  {
    name: 'notes',
    src: 'notepad.svg',
    class: 'icon',
    render: (targetEl) => {
      //

      const textArea = document.createElement('div');
      textArea.classList.add('editor');
      textArea.setAttribute('contenteditable', true);
      textArea.setAttribute('autofocus', true);
      textArea.style.width = `${100}%`;
      textArea.style.height = `${100}%`;
      textArea.innerHTML = 'Untitled';
      targetEl.appendChild(textArea);
    },
  },
];
let openApps = [];
let activeWindow = null;
const screen = document.getElementById('content');
const windowsContainer = document.getElementById('windows-container');

const secondMenuContainer = document.getElementById('menu__right-container');
const secondMenu = document.getElementById('menu__right');
const secondMenuOverlay = document.getElementById('menu__right-overlay');
const time = document.getElementById('time');

// EVENTS
window.addEventListener('DOMContentLoaded', initApp);

// EXECUTION
