import { file_system } from '../system/file_system.js';
import { Shell } from '../system/shell.js';
import { Folder, Notes, Papelera, Terminal } from './models.js';

export const defaultApps = [
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
  new Terminal(
    {
      id: 3,
      content: [],
    },
    new Shell(file_system)
  ),
];
const initialState = {
  apps: [],
  windows: [],
  desktopIcons: [],
  // [next steps]
  // ui: {
  //   windows: [],
  //   desktopIcons: [],
  // },
  // network:{},
  // storage:{},
  // preferences:{
  //  audio:{},
  //  theme:{},
  //  desktop:{
  //   bg:{}
  //   icons:{}
  //  }
  // }
};

//
let state = initialState;

export function getState() {
  return state; //⚠️ mutable
}

// WINDOWS

// selectors
export function getWindows() {
  return state.windows;
}
export function getWindow(id) {
  return state.windows.find((w) => w.id === id);
}
// reducers
export function setWindowName(id, name) {
  const windowApp = getWindow(id);

  if (!windowApp) {
    console.warn('window not found', { id, name });
    return;
  }
  windowApp.name = name;
}
