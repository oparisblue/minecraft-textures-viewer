import { AnimatedTextureElement } from "./customElements/AnimatedTextureElement";
import { TextureLoaderElement } from "./customElements/TextureLoaderElement";
import { TooltipElement } from "./customElements/TooltipElement";
import { initialiseDataSourceFromHashUrl } from "./initialiseDataSourceFromHashUrl";
import { addEventListenerToSearchBox } from "./ui/addEventListenerToSearchBox";
import { addOptionsToCreateDataSources } from "./ui/addOptionsToCreateDataSources";
import { hideModalOnKeyPress } from "./ui/showPreviewModal";

window.addEventListener("load", async () => {
  addOptionsToCreateDataSources();
  addEventListenerToSearchBox();
  hideModalOnKeyPress();

  await initialiseDataSourceFromHashUrl();
});

window.customElements.define("animated-texture", AnimatedTextureElement);
window.customElements.define("texture-loader", TextureLoaderElement);
window.customElements.define("tool-tip", TooltipElement);
