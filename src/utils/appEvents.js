export const APP_EVENTS = {
  UPDATE_UI: 'my-os__update-ui',
};

export function sendEventUpdateUI() {
  const updateUIEvent = new Event(APP_EVENTS.UPDATE_UI);
  document.dispatchEvent(updateUIEvent);
}
