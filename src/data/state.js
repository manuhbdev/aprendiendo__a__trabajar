const initialState = {
  windows: [],
  desktopIcons: [],
};

let state = initialState;
// STATE
export function updateState(newState) {
  state = { ...state, ...newState };
}
export function getState() {
  return { ...state };
}
// WINDOWS
export function getWindows() {
  return state.windows;
}
export function getWindow(id) {
  return state.windows.find((w) => w.id === id);
}
export function setWindowName(id, name) {
  const windowApp = getWindow(id);

  if (!windowApp) {
    console.warn('window not found', { id, name });
    return;
  }
  windowApp.name = name;
}
