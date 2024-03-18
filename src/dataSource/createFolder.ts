import { Folder } from "./dataSource";

export function createFolder(): Folder {
  return { subfolders: new Map(), items: new Map() };
}
