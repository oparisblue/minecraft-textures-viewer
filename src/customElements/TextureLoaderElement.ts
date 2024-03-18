import { DataSource, Item, LoadedItem } from "../dataSource/dataSource";
import { AnimatedTextureElement } from "./AnimatedTextureElement";

export class TextureLoaderElement extends HTMLElement {
  public item?: Item;
  public dataSource?: DataSource;

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const container = document.createElement("div");
    container.style.minWidth = "64px";
    container.style.minHeight = "64px";
    shadow.append(container);

    if (!this.item || !this.dataSource) {
      throw new Error("item and data source are required");
    }

    const loadedItem = await this.dataSource.loadItem(this.item);

    const element = getElementForItem(loadedItem);
    container.append(element);
  }
}

function getElementForItem(item: LoadedItem) {
  if (item.animation) {
    const animatedTexture = document.createElement(
      "animated-texture"
    ) as AnimatedTextureElement;

    animatedTexture.item = item;
    return animatedTexture;
  }

  const staticTexture = document.createElement("div");
  staticTexture.style.backgroundImage = `url(${item.image.src})`;
  staticTexture.style.backgroundSize = "contain";
  staticTexture.style.backgroundRepeat = "no-repeat";
  staticTexture.style.backgroundPosition = "center";
  staticTexture.style.imageRendering = "pixelated";
  staticTexture.style.width = "64px";
  staticTexture.style.height = "64px";
  return staticTexture;
}
