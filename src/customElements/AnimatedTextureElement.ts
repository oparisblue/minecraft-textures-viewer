import { LoadedItem } from "../dataSource/dataSource";

// Minecraft animations are constrained to TPS. Under ideal load, Minecraft runs at 20 ticks per second
const TIME_PER_FRAME_MS = 1000 / 20;

export class AnimatedTextureElement extends HTMLElement {
  private intervalId: number | null = null;
  public item?: LoadedItem;
  public size?: number = 64;

  constructor() {
    super();
  }

  async connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const item = this.item;
    if (!item || !item.animation) throw new Error("animated item is required");

    const canvas = document.createElement("canvas");

    const imageSize = item.image.width;
    const animation = item.animation;

    canvas.width = imageSize;
    canvas.height = imageSize;
    canvas.style.imageRendering = "pixelated";
    canvas.style.width = `${this.size}px`;
    canvas.style.height = `${this.size}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("No canvas context");
    ctx.imageSmoothingEnabled = false;

    let frameNumber = 0;
    let timeOnFrame = 0;

    const originalImageData = getTextureImageData(item.image);
    const frameDataSize = imageSize ** 2 * 4; // square image, RGBA

    this.intervalId = setInterval(() => {
      if (timeOnFrame++ >= animation.frames[frameNumber].frameTime) {
        timeOnFrame = 0;
        frameNumber = (frameNumber + 1) % animation.frames.length;
      }

      const yOffset = imageSize * animation.frames[frameNumber].index;

      ctx.clearRect(0, 0, imageSize, imageSize);
      ctx.drawImage(
        item.image,
        // sx, sy, sw, sh
        0,
        yOffset,
        imageSize,
        imageSize,
        // dx, dy, dw, dh
        0,
        0,
        imageSize,
        imageSize
      );

      if (!animation.interpolate) return;

      const delta = timeOnFrame / animation.frames[frameNumber].frameTime;

      const nextFrameNumber = (frameNumber + 1) % animation.frames.length;
      const nextFrameIndex = animation.frames[nextFrameNumber].index;
      const nextFrameDataOffset = frameDataSize * nextFrameIndex;

      const frameImageData = ctx.getImageData(0, 0, imageSize, imageSize);
      for (let i = 0; i < frameImageData.data.length; i++) {
        frameImageData.data[i] = lerp(
          delta,
          frameImageData.data[i],
          originalImageData.data[nextFrameDataOffset + i]
        );
      }
      ctx.putImageData(frameImageData, 0, 0, 0, 0, imageSize, imageSize);
    }, TIME_PER_FRAME_MS);

    shadow.append(canvas);
  }

  disconnectedCallback() {
    if (this.intervalId != null) {
      clearInterval(this.intervalId);
    }
  }
}

function lerp(delta: number, from: number, to: number): number {
  return delta * (to - from) + from;
}

function getTextureImageData(image: HTMLImageElement): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No canvas context");

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, 0, 0);

  return ctx.getImageData(0, 0, image.width, image.height);
}
