import {
  APP_STATES,
  DesktopIcon,
  Folder,
  Notes,
  Papelera,
  Window,
} from './src/models/models.js';

// window state
function updateActiveWindow(app) {
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
function rightClickHandler(e) {
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
  const app = new Folder({
    id: apps.length,
    name: 'new-folder',
    icon: 'folder.svg',
    content: [],
  });
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
  drawDesktopIcons(desktopIcons, desktopIconsContainer);
  drawWindows(windows, windowsContainer);
}
function actionNewFile() {
  console.log('new-file');
  const newFile = new File({
    id: apps.length,
    name: 'new-file',
    content: '',
  });
  apps.push(newFile);
}
function actionPersonalizar() {
  console.log('personalizar');
}
function actionSettings() {
  console.log('settings');
}

// listeners
function setListener__rightClick__on__screen(screenEl, overlay) {
  screenEl.addEventListener('contextmenu', (e) => rightClickHandler(e), false);
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
// [START]
function initApp() {
  // UI
  drawDesktopIcons(desktopIcons, desktopIconsContainer);
  drawWindows(windows, windowsContainer);
  // listeners
  setListener__rightClick__on__screen(screenElement, rightClickMenuOverlay);
  setListener__click__on__action(actionsButtons);

  // intervals
  setClockInterval(timeElement);
  setFooterBarUpdateInterval();
}
function createApps() {
  apps.forEach((app) => {
    desktopIcons.push(
      new DesktopIcon({ id: app.id, icon: app.icon, name: app.name, app })
    );
    windows.push(
      new Window({ id: app.id, name: app.name, icon: app.icon, app })
    );
  });
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
let windows = [];
let desktopIcons = [];
createApps();
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
