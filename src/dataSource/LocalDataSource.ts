import { createFolder } from "./createFolder";
import {
  DataSource,
  Folder,
  Item,
  LoadedItem,
  McMetaAnimation
} from "./dataSource";
import { translateMcMetaAnimation } from "./translateMcMetaAnimation";

export class LocalDataSource implements DataSource {
  constructor(private directory: FileSystemDirectoryHandle) {}

  getNavBarClass(): string {
    return "local";
  }

  addDescriptionToNav(menu: HTMLElement): void {
    const title = document.createElement("div");
    title.innerText = this.directory.name;
    const subtitle = document.createElement("div");
    subtitle.innerText = "Local";

    menu.append(title);
    menu.append(subtitle);
  }

  async getRootFolder(): Promise<Folder> {
    return this.loadFoldersRecursively(this.directory, "");
  }

  async loadItem(item: Item): Promise<LoadedItem> {
    const { imageHandle, mcMetaHandle } = await this.findImageAndMcMeta(item);

    const image = await this.loadImage(imageHandle);
    const animation = await this.loadMcMeta(
      mcMetaHandle,
      item.mcMetaPath,
      image
    );

    return {
      image,
      animation
    };
  }

  private async loadFoldersRecursively(
    parent: FileSystemDirectoryHandle,
    path: string
  ): Promise<Folder> {
    const folder = createFolder();

    const fileNameAndMcMetaRegex = /(.*)\.png(\.mcmeta)?/;

    for await (const [name, handle] of parent.entries()) {
      if (handle.kind === "directory") {
        const subfolder = await this.loadFoldersRecursively(
          handle,
          `${path}/${name}`
        );
        folder.subfolders.set(name, subfolder);
        continue;
      }

      const matches = name.match(fileNameAndMcMetaRegex);
      if (!matches) continue;
      const [, itemName, mcMeta] = matches as [unknown, string, string];

      const isAnimated = mcMeta != null;
      const itemExists = folder.items.has(name);

      if (!itemExists || isAnimated) {
        folder.items.set(itemName, {
          imagePath: `${path}/${itemName}.png`,
          mcMetaPath: isAnimated ? `${path}/${itemName}.png.mcmeta` : undefined
        });
      }
    }

    return folder;
  }

  private async findImageAndMcMeta(item: Item) {
    const parts = item.imagePath.slice(1).split("/");

    let folder = this.directory;
    for (const part of parts.slice(0, -1)) {
      folder = await folder.getDirectoryHandle(part);
    }

    const itemName = parts.at(-1);
    if (!itemName) throw new Error("Couldn't find item");

    let imageHandle = await folder.getFileHandle(itemName);
    let mcMetaHandle;

    if (item.mcMetaPath) {
      mcMetaHandle = await folder.getFileHandle(`${itemName}.mcmeta`);
    }

    return { imageHandle, mcMetaHandle };
  }

  private async loadImage(
    imageHandle: FileSystemFileHandle
  ): Promise<HTMLImageElement> {
    return new Promise(async (resolve) => {
      const file = await imageHandle.getFile();
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const image = new Image();
        image.src = reader.result as string;
        resolve(image);
      });

      reader.readAsDataURL(file);
    });
  }

  private async loadMcMeta(
    mcMetaHandle: FileSystemFileHandle | undefined,
    mcMetaPath: string | undefined,
    image: HTMLImageElement
  ): Promise<McMetaAnimation | undefined> {
    if (!mcMetaHandle) return;

    let fileText;

    try {
      const file = await mcMetaHandle.getFile();
      fileText = await file.text();
      const mcMetaJson = JSON.parse(fileText);
      return translateMcMetaAnimation(mcMetaJson, image);
    } catch (error) {
      console.error(`Couldn't load ${mcMetaPath}:`, error, fileText);
    }
  }
}
