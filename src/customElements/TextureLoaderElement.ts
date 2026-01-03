import { DataSource, Item, LoadedItem } from "../dataSource/dataSource";
import { AnimatedTextureElement } from "./AnimatedTextureElement";

export class TextureLoaderElement extends HTMLElement {
  public size?: number = 64;
  public item?: Item;
  public dataSource?: DataSource;
  private loadedItem?: LoadedItem;

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.style.minWidth = `${this.size}px`;
    container.style.minHeight = `${this.size}px`;
    shadow.append(container);

    if (!this.item || !this.dataSource) {
      throw new Error("item and data source are required");
    }

    this.loadedItem = await this.dataSource.loadItem(this.item);

    const element = this.getElementForItem(this.loadedItem);
    container.append(element);
  }

  private getElementForItem(item: LoadedItem) {
    if (item.animation) {
      const animatedTexture = document.createElement(
        "animated-texture"
      ) as AnimatedTextureElement;

      animatedTexture.item = item;
      animatedTexture.size = this.size;
      return animatedTexture;
    }

    const staticTexture = document.createElement("div");
    staticTexture.style.backgroundImage = `url("${item.image.src}")`;
    staticTexture.style.backgroundSize = "contain";
    staticTexture.style.backgroundRepeat = "no-repeat";
    staticTexture.style.backgroundPosition = "center";
    staticTexture.style.imageRendering = "pixelated";
    staticTexture.style.width = `${this.size}px`;
    staticTexture.style.height = `${this.size}px`;
    return staticTexture;
  }

  public async downloadItem() {
    if (!this.loadedItem) return;

    const imageName = this.item?.imagePath.split("/").at(-1) ?? "texture.png";

    const image = await fetch(this.loadedItem.image.src);
    const blob = await image.blob();
    this.downloadBlob(blob, imageName);

    if (this.loadedItem.animation) {
      const mcMetaJson = new Blob([this.loadedItem.animation.rawJson], {
        type: "application/json"
      });
      this.downloadBlob(mcMetaJson, `${imageName}.mcmeta`);
    }
  }

  private downloadBlob(blob: Blob, name: string) {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = name;
    link.click();
  }
}
