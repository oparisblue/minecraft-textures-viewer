import { TextureLoaderElement } from "../customElements/TextureLoaderElement";
import { TooltipElement } from "../customElements/TooltipElement";
import { DataSource, Folder, Item } from "../dataSource/dataSource";

export async function displayTexturesForDataSource(
  dataSource: DataSource
): Promise<void> {
  updateNavBarColor(dataSource);
  updateNavBarDescription(dataSource);
  updateNavBarMenuItems(dataSource);

  clearSearchBar();

  await displayListOfTextures(dataSource);
}

function updateNavBarColor(dataSource: DataSource) {
  const nav = document.querySelector("nav") as HTMLElement;
  nav.setAttribute("class", dataSource.getNavBarClass());
}

function updateNavBarDescription(dataSource: DataSource) {
  const description = document.querySelector(".dataSource") as HTMLElement;
  description.innerHTML = "";
  dataSource.addDescriptionToNav(description);
}

function updateNavBarMenuItems(dataSource: DataSource) {
  const extraMenuItems = document.querySelector(
    "#dataSourceMenuExtraItems"
  ) as HTMLElement;

  extraMenuItems.innerHTML = "";
  dataSource.addItemsToMenu?.(extraMenuItems);

  if (extraMenuItems.childNodes.length > 0) {
    const divider = document.createElement("div");
    divider.classList.add("divider");
    extraMenuItems.append(divider);
  }
}

function clearSearchBar() {
  const searchBar = document.querySelector("#search") as HTMLInputElement;
  searchBar.value = "";
}

async function displayListOfTextures(dataSource: DataSource) {
  const rootFolder = await dataSource.getRootFolder();
  const subfolders = getAllSubfolders(rootFolder);

  const textures = document.createDocumentFragment();

  for (const folder of subfolders) {
    const searchableFolderName = folder.name.toString().trim();

    for (const [name, item] of folder.items) {
      const searchableItemName = name.toLowerCase().trim();

      const container = document.createElement("tool-tip") as TooltipElement;
      container.text = `${folder.name}/${name}`;
      container.setAttribute(
        "data-searchable-name",
        `${searchableFolderName}/${searchableItemName}`
      );

      const loader = document.createElement(
        "texture-loader"
      ) as TextureLoaderElement;
      loader.dataSource = dataSource;
      loader.item = item;

      container.append(loader);
      textures.append(container);
    }
  }

  const container = document.querySelector("#textures") as HTMLElement;
  container.innerHTML = "";
  container.append(textures);
}

function getAllSubfolders(
  folder: Folder
): { items: Map<string, Item>; name: string }[] {
  const subfolders: { items: Map<string, Item>; name: string }[] = [];

  for (const [name, subfolder] of folder.subfolders) {
    const subSubFolders = getAllSubfolders(subfolder);
    subfolders.push(...subSubFolders);
    subfolders.push({ name, items: subfolder.items });
  }

  return subfolders;
}
