import { TextureLoaderElement } from "../customElements/TextureLoaderElement";
import { DataSource, Item } from "../dataSource/dataSource";

export function showPreviewModal(dataSource: DataSource, item: Item) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const loader = document.createElement(
    "texture-loader"
  ) as TextureLoaderElement;
  loader.size = Math.min(window.innerHeight, window.innerWidth) - 40;
  loader.dataSource = dataSource;
  loader.item = item;

  modal.append(loader);

  overlay.addEventListener("click", hideModal);
  modal.addEventListener("click", hideModal);

  document.body.append(overlay);
  document.body.append(modal);
}

export function hideModalOnKeyPress() {
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      hideModal();
    }
  });
}

function hideModal() {
  document.querySelector(".overlay")?.remove();
  document.querySelector(".modal")?.remove();
}
