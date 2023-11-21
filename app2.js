import { getState, getWindows, getWindow } from './src/data/state.js';
import {
  APP_STATES,
  DesktopIcon,
  Folder,
  File,
  RESOURCE_TYPES,
  Window,
} from './src/data/models.js';
import { APP_EVENTS, sendEventUpdateUI } from './src/utils/appEvents.js';

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
}
function openApp(id) {
  const w = getWindow(id);
  w.open();
  updateActiveWindow(w);
  sendEventUpdateUI();
}
function appendAppToUIElements(app) {
  const { desktopIcons, windows, apps } = getState();
  apps.push(app);
  desktopIcons.push(
    new DesktopIcon({
      id: app.id,
      icon: app.icon,
      name: app.name,
      app,
    })
  );
  windows.push(
    new Window({
      id: app.id,
      name: app.name,
      icon: app.icon,
      app,
    })
  );
}
// draw UI
function updateUIHandler() {
  const { desktopIcons, windows } = getState();

  drawDesktopIcons(desktopIcons, desktopIconsContainer);
  drawWindows(windows, windowsContainer);
  drawFooterAppBar(windows, footerAppBarContainer);

  console.log({ state: getState() });
}
function drawDesktopIcons(icons, targetContainer) {
  targetContainer.innerHTML = '';
  icons.forEach((icon) => {
    const iconHTML = icon.getHTML();
    const iconImg = iconHTML.querySelector('img');
    iconImg.onclick = () => openApp(icon.id);
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
function createName(initialName, type) {
  const { apps } = getState();
  const appNameList = apps
    .filter((app) => app.type === type)
    .map((folder) => folder.name);
  //
  let newName = initialName;
  let counter = 1;
  while (appNameList.includes(newName)) {
    newName = `${initialName}_${counter}`;
    counter++;
  }
  return newName;
}
// actions
function actionNewFolder() {
  const { apps } = getState();
  const defaultName = createName('new-folder', RESOURCE_TYPES.FOLDER);
  const newFolderApp = new Folder({
    id: apps.length,
    name: defaultName,
    icon: 'folder.svg',
    content: [],
  });
  //
  appendAppToUIElements(newFolderApp);
  sendEventUpdateUI();
}
function actionNewFile() {
  console.log('new-file');
  const { apps } = getState();
  const defaultName = createName('new-file', RESOURCE_TYPES.FILE);
  const newFileApp = new File({
    id: apps.length,
    name: defaultName,
    className: 'file',
    type: '',
    icon: 'txt.svg',
    content: '',
  });
  //
  appendAppToUIElements(newFileApp);
  sendEventUpdateUI();
}
function actionNewResource(defaultName, type) {
  const { apps } = getState();
  const resourceName = createName(defaultName, type);
  let newResourceApp = null;

  switch (type) {
    case RESOURCE_TYPES.FILE:
      newResourceApp = new File({
        id: apps.length,
        name: resourceName,
        className: 'file',
        type: '',
        icon: 'txt.svg',
        content: '',
      });
      break;
    case RESOURCE_TYPES.FOLDER:
      newResourceApp = new Folder({
        id: apps.length,
        name: resourceName,
        icon: 'folder.svg',
        content: [],
      });
      break;
    default:
      console.warn('unknown resource', { defaultName, type });
      return;
      break;
  }
  //
  appendAppToUIElements(newResourceApp);
  sendEventUpdateUI();
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
          actionNewResource('new-folder', RESOURCE_TYPES.FOLDER);
          break;
        case 'new-file':
          actionNewResource('new-file', RESOURCE_TYPES.FILE);
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
  // listeners
  setListener__rightClick__on__screen(screenElement, rightClickMenuOverlay);
  setListener__click__on__action(actionsButtons);
  setListener__updateUI();
  // intervals
  setClockInterval(timeElement);
  //UI
  createUI();
}
function createUI() {
  const { apps } = getState(); // mutable
  apps.forEach((app) => appendAppToUIElements(app));
  sendEventUpdateUI();
}

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
