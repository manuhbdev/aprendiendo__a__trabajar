import { getState } from '../data/state.js';

export function createName(initialName, type) {
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
