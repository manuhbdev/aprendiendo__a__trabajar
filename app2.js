import { getState, getWindows, updateState } from './src/data/state.js';
import {
  APP_STATES,
  DesktopIcon,
  Folder,
  Notes,
  Papelera,
  Window,
} from './src/data/models.js';
import { APP_EVENTS, sendEventUpdateUI } from './src/utils/appEvents.js';

// window state
function updateActiveWindow(app) {
  const windows = getWindows();
  windows.forEach((w) => {
    if (w.id === app.id) {
      w.isActive = true;
      w.windowHTML.classList.remove('close');
      w.windowHTML.classList.remove('min');
      w.windowHTML.classList.add('open');
      w.windowHTML.classList.add('active');
    } else {
      w.isActive = false;
      w.windowHTML.classList.remove('active');
    }
  });
  drawFooterAppBar(windows, footerAppBarContainer);
}
function openApp(id) {
  const { windows } = getState();

  const w = windows.find((_app) => _app.id === id);
  w.open();
  updateActiveWindow(w);
  drawFooterAppBar(windows, footerAppBarContainer);
}
// draw UI
function drawDesktopIcons(icons, targetContainer) {
  targetContainer.innerHTML = '';
  icons.forEach((icon) => {
    const iconHTML = icon.getHTML();
    iconHTML.onclick = () => openApp(icon.id);
    targetContainer.appendChild(iconHTML);
  });
}
function drawWindows(windows, targetContainer) {
  targetContainer.innerHTML = '';
  windows.forEach((w) => {
    const windowHTML = w.windowHTML;
    const windowName = windowHTML.querySelector('.window__header .name');
    const windowAppName = windowHTML.querySelector('.window__header .app-name');
    // update name
    windowAppName.innerText = w.name;
    const windowContent = windowHTML.querySelector('.window__content');
    if (windowContent.innerHTML === '') {
      w.app.renderContent(windowContent);
    }
    targetContainer.appendChild(windowHTML);
    windowName.onclick = () => updateActiveWindow(w.app);
    windowContent.onclick = () => updateActiveWindow(w.app);
  });
}
function drawFooterAppBar(windows, targetContainer) {
  //
  targetContainer.innerHTML = '';

  const onlyOpenedWindows = windows.filter(
    (w) => w.state !== APP_STATES.CLOSED
  );
  onlyOpenedWindows.forEach((w) => {
    const footerApp = document.createElement('div');
    footerApp.id = w.id;
    footerApp.classList.add('min__app');
    if (w.isActive) {
      footerApp.classList.add('active');
    }
    footerApp.innerHTML = `<img width="32px" src="/img/icons/${w.icon}"/>`;

    footerApp.onclick = () => {
      openApp(w.id);
    };
    targetContainer.appendChild(footerApp);
  });
}
// right-click menu
function rightClickMenuHandler(e) {
  e.preventDefault();

  if (e.target.closest('#windows-container') || e.target.closest('#navbar')) {
    console.warn('invalid on window');
    return;
  }
  showRightClickMenu();
  secondMenu.style.top = `${e.offsetY}px`;
  secondMenu.style.left = `${e.offsetX + 1}px`;
}
function showRightClickMenu() {
  secondMenuContainer.style.display = 'flex';
}
function hideRightClickMenu() {
  secondMenuContainer.style.display = 'none';
}
// intervals
function setClockInterval(targetEl) {
  setInterval(() => {
    var date = new Date();
    const day = ('00' + date.getDate()).slice(-2);
    const month = ('00' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ('00' + date.getHours()).slice(-2);
    const minutes = ('00' + date.getMinutes()).slice(-2);
    const seconds = ('00' + date.getMinutes()).slice(-2);

    targetEl.innerText = `${hours}:${minutes}`;
  }, 1 * 1000);
}
function setFooterBarUpdateInterval() {
  setInterval(() => {
    drawFooterAppBar(windows, footerAppBarContainer);
  }, 300);
}
//actions
function actionNewFolder() {
  console.log('new-folder');
  const { desktopIcons, windows } = getState();
  const newFolderApp = new Folder({
    id: apps.length,
    name: 'new-folder',
    icon: 'folder.svg',
    content: [],
  });
  apps.push(newFolderApp);
  desktopIcons.push(
    new DesktopIcon({
      id: newFolderApp.id,
      icon: newFolderApp.icon,
      name: newFolderApp.name,
      app: newFolderApp,
    })
  );
  windows.push(
    new Window({
      id: newFolderApp.id,
      name: newFolderApp.name,
      icon: newFolderApp.icon,
      app: newFolderApp,
    })
  );
  sendEventUpdateUI();
}
function actionNewFile() {
  console.log('new-file');
}
function actionPersonalizar() {
  console.log('personalizar');
}
function actionSettings() {
  console.log('settings');
}

// listeners
function setListener__rightClick__on__screen(screenEl, overlay) {
  screenEl.addEventListener(
    'contextmenu',
    (e) => rightClickMenuHandler(e),
    false
  );
  overlay.onclick = () => hideRightClickMenu();
}
function setListener__click__on__action(actions) {
  actions.forEach((action) => {
    action.onclick = (e) => {
      const btn = e.target.closest('.action');
      switch (btn.name) {
        case 'new-folder':
          actionNewFolder();

          break;
        case 'new-file':
          actionNewFile();

          break;
        case 'personalizar':
          actionPersonalizar();

          break;
        case 'settings':
          actionSettings();

          break;
        default:
          console.warn('invalid action');
          break;
      }
      hideRightClickMenu();
    };
  });
}

function setListener__updateUI() {
  document.addEventListener(APP_EVENTS.UPDATE_UI, updateUIHandler);
}

// [START]
function initApp() {
  // data
  createApps();
  // listeners
  setListener__rightClick__on__screen(screenElement, rightClickMenuOverlay);
  setListener__click__on__action(actionsButtons);
  setListener__updateUI();
  // intervals
  setClockInterval(timeElement);
  //
  sendEventUpdateUI();
}
function updateUIHandler() {
  const { desktopIcons, windows } = getState();

  drawDesktopIcons(desktopIcons, desktopIconsContainer);
  drawWindows(windows, windowsContainer);
  drawFooterAppBar(windows, footerAppBarContainer);

  console.log({ state: getState() });
}
function createApps() {
  const { desktopIcons, windows } = getState();
  apps.forEach((app) => {
    desktopIcons.push(
      new DesktopIcon({ id: app.id, icon: app.icon, name: app.name, app })
    );
    windows.push(
      new Window({ id: app.id, name: app.name, icon: app.icon, app })
    );
  });
  updateState({ windows, desktopIcons });
}

const apps = [
  new Folder({
    id: 0,
    name: 'documents',
    icon: 'folder.svg',
    content: [
      {
        name: 'estatuto_fundación',
        type: 'docx',
        icon: 'docx.svg',
      },
      {
        name: 'cv-final-final',
        type: 'docx',
        icon: 'docx.svg',
      },
      {
        name: 'cv-final',
        type: 'docx',
        icon: 'docx.svg',
      },
      {
        name: 'cv-final-english',
        type: 'docx',
        icon: 'docx.svg',
      },
    ],
  }),
  new Papelera({
    id: 1,
    name: 'Papelera',
    icon: 'trash-can.svg',
    content: [
      {
        name: 'movies___XXX',
        type: 'zip',
        icon: 'zip.svg',
      },
    ],
  }),
  new Notes({
    id: 2,
    content: [],
  }),
];

// UI ref
const screenElement = document.getElementById('content');
const secondMenuContainer = document.getElementById('menu__right-container');
const secondMenu = document.getElementById('menu__right');
const rightClickMenuOverlay = document.getElementById('menu__right-overlay');
const timeElement = document.getElementById('time');

const windowsContainer = document.getElementById('windows-container');
const desktopIconsContainer = document.getElementById('icons');
const footerAppBarContainer = document.getElementById('footer-app-bar');
const actionsButtons = document.querySelectorAll('.action');

// RUN
window.addEventListener('DOMContentLoaded', initApp);
