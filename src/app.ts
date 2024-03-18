import { AnimatedTextureElement } from "./customElements/AnimatedTextureElement";
import { TextureLoaderElement } from "./customElements/TextureLoaderElement";
import { TooltipElement } from "./customElements/TooltipElement";
import { GithubDataSource } from "./dataSource/GithubDataSource";
import { initialiseDataSourceFromHashUrl } from "./initialiseDataSourceFromHashUrl";
import { addEventListenerToSearchBox } from "./ui/addEventListenerToSearchBox";
import { addOptionsToCreateDataSources } from "./ui/addOptionsToCreateDataSources";
import { displayTexturesForDataSource } from "./ui/displayTexturesForDataSource";

window.addEventListener("load", async () => {
  addOptionsToCreateDataSources();
  addEventListenerToSearchBox();

  await initialiseDataSourceFromHashUrl();
});

window.customElements.define("animated-texture", AnimatedTextureElement);
window.customElements.define("texture-loader", TextureLoaderElement);
window.customElements.define("tool-tip", TooltipElement);
