import { AnimationFrame, McMetaAnimation } from "./dataSource";

export function translateMcMetaAnimation(
  mcMetaJson: any,
  image: HTMLImageElement
): McMetaAnimation {
  // All frames must be the same size, and square, so we can just use the width.
  const frameSize = image.width;

  // Animation frames are stored in a vertical strip, with each frame directly
  // underneath the previous one.
  const baseNumberOfFrames = image.height / frameSize;

  const baseFrameTime = mcMetaJson.animation.frametime ?? 1;
  const interpolate = mcMetaJson.animation.interpolate ?? false;
  const frames = mcMetaJson.animation.frames;

  return {
    interpolate,
    frames: frames
      ? processFramesArray(frames, baseFrameTime)
      : getSimpleIncrementedFrames(baseNumberOfFrames, baseFrameTime)
  };
}

function getSimpleIncrementedFrames(
  numberOfFrames: number,
  frameTime: number
): AnimationFrame[] {
  return [...new Array(numberOfFrames)].map((_, index) => ({
    frameTime,
    index
  }));
}

function processFramesArray(
  frames: (number | { index: number; time: number })[],
  baseFrameTime: number
): AnimationFrame[] {
  return frames.map((item) => {
    if (typeof item === "number") {
      return { index: item, frameTime: baseFrameTime };
    }

    return { index: item.index, frameTime: item.time };
  });
}
