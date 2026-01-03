export interface McMetaAnimation {
  interpolate: boolean;
  frames: AnimationFrame[];
  rawJson: string;
}

export interface AnimationFrame {
  frameTime: number;
  index: number;
}

export interface Item {
  imagePath: string;
  mcMetaPath?: string;
}

export interface LoadedItem {
  image: HTMLImageElement;
  animation?: McMetaAnimation;
}

export interface Folder {
  subfolders: Map<string, Folder>;
  items: Map<string, Item>;
}

export interface DataSource {
  getNavBarClass(): string;
  addDescriptionToNav(menu: HTMLElement): void;
  addItemsToMenu?(menu: HTMLElement): void;
  getRootFolder(): Promise<Folder>;
  loadItem(item: Item): Promise<LoadedItem>;
}
