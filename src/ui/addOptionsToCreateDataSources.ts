import { GithubDataSource } from "../dataSource/GithubDataSource";
import { LocalDataSource } from "../dataSource/LocalDataSource";
import { displayTexturesForDataSource } from "./displayTexturesForDataSource";

export function addOptionsToCreateDataSources() {
  const container = document.querySelector(
    "#dataSourceMenuOpenItems"
  ) as HTMLElement;

  const githubMenuItem = document.createElement("div");
  githubMenuItem.addEventListener("click", openFromGithub);
  githubMenuItem.innerText = "Open from GitHub";

  const localMenuItem = document.createElement("div");
  localMenuItem.addEventListener("click", openFromLocal);
  localMenuItem.innerText = "Open from your computer";

  container.append(githubMenuItem);
  container.append(localMenuItem);
}

async function openFromGithub() {
  const url = prompt(
    "Enter the URL to a GitHub repo, and we'll find the textures in it:"
  );

  if (!url) return;

  const matches = url.match(/^(https?:\/\/)?github\.com\/([^\/]+)\/([^\/]+)/);
  if (!matches) return;

  const [, , username, repo] = matches as [unknown, unknown, string, string];

  const repoInfoUrl = `https://api.github.com/repos/${username}/${repo}`;
  const repoInfo = await fetch(repoInfoUrl);
  const { default_branch: branch } = await repoInfo.json();

  window.location.hash = `github/${username}/${repo}/${branch}`;

  displayTexturesForDataSource(
    new GithubDataSource(username, repo, branch, "")
  );
}

async function openFromLocal() {
  if (!window.showDirectoryPicker) {
    alert("Your browser does not support selecting directories. Try Chrome.");
    return;
  }

  const directory = await window.showDirectoryPicker();

  window.location.hash = "";
  displayTexturesForDataSource(new LocalDataSource(directory));
}
