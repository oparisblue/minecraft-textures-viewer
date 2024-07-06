"use strict";(()=>{var A=1e3/20,E=class extends HTMLElement{intervalId=null;item;size=64;constructor(){super()}async connectedCallback(){let t=this.attachShadow({mode:"open"}),e=this.item;if(!e||!e.animation)throw new Error("animated item is required");let n=document.createElement("canvas"),a=e.image.width,r=e.animation;n.width=a,n.height=a,n.style.imageRendering="pixelated",n.style.width=`${this.size}px`,n.style.height=`${this.size}px`;let i=n.getContext("2d",{willReadFrequently:!0});if(!i)throw new Error("No canvas context");i.imageSmoothingEnabled=!1;let s=0,c=0,m=C(e.image),u=a**2*4;this.intervalId=setInterval(()=>{c++>=r.frames[s].frameTime&&(c=0,s=(s+1)%r.frames.length);let d=a*r.frames[s].index;if(i.clearRect(0,0,a,a),i.drawImage(e.image,0,d,a,a,0,0,a,a),!r.interpolate)return;let l=c/r.frames[s].frameTime,M=(s+1)%r.frames.length,P=r.frames[M].index,O=u*P,w=i.getImageData(0,0,a,a);for(let h=0;h<w.data.length;h++)w.data[h]=k(l,w.data[h],m.data[O+h]);i.putImageData(w,0,0,0,0,a,a)},A),t.append(n)}disconnectedCallback(){this.intervalId!=null&&clearInterval(this.intervalId)}};function k(o,t,e){return o*(e-t)+t}function C(o){let t=document.createElement("canvas");t.width=o.width,t.height=o.height;let e=t.getContext("2d");if(!e)throw new Error("No canvas context");return e.imageSmoothingEnabled=!1,e.drawImage(o,0,0),e.getImageData(0,0,o.width,o.height)}var b=class extends HTMLElement{size=64;item;dataSource;constructor(){super()}async connectedCallback(){let t=this.attachShadow({mode:"open"}),e=document.createElement("div");if(e.style.minWidth=`${this.size}px`,e.style.minHeight=`${this.size}px`,t.append(e),!this.item||!this.dataSource)throw new Error("item and data source are required");let n=await this.dataSource.loadItem(this.item),a=this.getElementForItem(n);e.append(a)}getElementForItem(t){if(t.animation){let n=document.createElement("animated-texture");return n.item=t,n.size=this.size,n}let e=document.createElement("div");return e.style.backgroundImage=`url("${t.image.src}")`,e.style.backgroundSize="contain",e.style.backgroundRepeat="no-repeat",e.style.backgroundPosition="center",e.style.imageRendering="pixelated",e.style.width=`${this.size}px`,e.style.height=`${this.size}px`,e}};var y=class extends HTMLElement{teardown;text;constructor(){super()}connectedCallback(){let t=this.attachShadow({mode:"open"}),e=this.text??"",n=document.createElement("div");n.addEventListener("mouseenter",r=>{let i=document.createElement("div");i.classList.add("tooltip"),i.innerText=e,this.positionTooltip(i,r),document.body.append(i);let s=c=>{this.positionTooltip(i,c)};document.body.addEventListener("mousemove",s),this.teardown=()=>{document.body.removeEventListener("mousemove",s),i.remove()}}),n.addEventListener("mouseleave",()=>{this.teardown?.()});let a=document.createElement("slot");n.append(a),t.append(n)}positionTooltip(t,e){let{width:n,height:a}=t.getBoundingClientRect(),r=I(window.innerWidth,n,e.clientX),i=I(window.innerHeight,a,e.clientY),s=[!r&&`left: ${e.clientX+10}px;`,r&&`right: ${window.innerWidth-e.clientX+10}px;`,!i&&`top: ${e.clientY+10}px;`,i&&`bottom: ${window.innerHeight-e.clientY+10}px;`].filter(c=>c).join("");t.setAttribute("style",s)}disconnectedCallback(){this.teardown?.()}};function I(o,t,e){return e>=o-t-10-10}function f(){return{subfolders:new Map,items:new Map}}function v(o,t){let e=t.width,n=t.height/e,a=o.animation.frametime??1,r=o.animation.interpolate??!1,i=o.animation.frames;return{interpolate:r,frames:i?R(i,a):N(n,a)}}function N(o,t){return[...new Array(o)].map((e,n)=>({frameTime:t,index:n}))}function R(o,t){return o.map(e=>typeof e=="number"?{index:e,frameTime:t}:{index:e.index,frameTime:e.time})}var p=class{constructor(t,e,n,a){this.username=t;this.repo=e;this.branch=n;this.root=a}getNavBarClass(){return"github"}addDescriptionToNav(t){let e=document.createElement("div");e.innerText=`${this.username}/${this.repo}`;let n=document.createElement("div");n.innerText="GitHub",t.append(e),t.append(n)}addItemsToMenu(t){let e=document.createElement("div");e.innerText="View on GitHub",e.addEventListener("click",()=>{window.open(`https://github.com/${this.username}/${this.repo}`)}),t.append(e)}async getRootFolder(){let t=`https://api.github.com/repos/${this.username}/${this.repo}/git/trees/${this.branch}?recursive=1`,e=await fetch(t),{tree:n}=await e.json(),a=f(),r=/^(.*)\/(.*)\.png(\.mcmeta)?$/;for(let i of n){let s=i.path.match(r);if(!s)continue;let[,c,m,u]=s;if(!c.startsWith(this.root))continue;let d=this.findOrCreateSubfolder(a,c),l=u!=null;(!d.items.has(m)||l)&&d.items.set(m,{imagePath:`${c}/${m}.png`,mcMetaPath:l?`${c}/${m}.png.mcmeta`:void 0})}return a}async loadItem(t){let e=await this.loadImage(t.imagePath),n=await this.loadMcMeta(t.mcMetaPath,e);return{image:e,animation:n}}findOrCreateSubfolder(t,e){let n=e.split("/"),a=t;for(let r of n)a.subfolders.has(r)||a.subfolders.set(r,f()),a=a.subfolders.get(r);return a}getGithubUserContentPath(t){return`https://raw.githubusercontent.com/${this.username}/${this.repo}/${this.branch}/${t}`}loadImage(t){return new Promise(e=>{let n=new Image;n.src=this.getGithubUserContentPath(t),n.crossOrigin="anonymous",n.addEventListener("load",()=>{e(n)})})}async loadMcMeta(t,e){if(t)try{let a=await(await fetch(this.getGithubUserContentPath(t))).json();return v(a,e)}catch(n){console.error(`Couldn't load ${t}:`,n)}}};function F(o,t){let e=document.createElement("div");e.classList.add("overlay");let n=document.createElement("div");n.classList.add("modal");let a=document.createElement("texture-loader");a.size=Math.min(window.innerHeight,window.innerWidth)-40,a.dataSource=o,a.item=t,n.append(a),e.addEventListener("click",T),n.addEventListener("click",T),document.body.append(e),document.body.append(n)}function L(){document.body.addEventListener("keydown",o=>{o.key==="Escape"&&(o.preventDefault(),T())})}function T(){document.querySelector(".overlay")?.remove(),document.querySelector(".modal")?.remove()}async function g(o){_(o),z(o),B(o),q(),await G(o)}function _(o){document.querySelector("nav").setAttribute("class",o.getNavBarClass())}function z(o){let t=document.querySelector(".dataSource");t.innerHTML="",o.addDescriptionToNav(t)}function B(o){let t=document.querySelector("#dataSourceMenuExtraItems");if(t.innerHTML="",o.addItemsToMenu?.(t),t.childNodes.length>0){let e=document.createElement("div");e.classList.add("divider"),t.append(e)}}function q(){let o=document.querySelector("#search");o.value=""}async function G(o){let t=await o.getRootFolder(),e=S(t),n=document.createDocumentFragment();for(let r of e){let i=r.name.toString().trim(),s=[...r.items.entries()].sort((c,m)=>c[0].localeCompare(m[0]));for(let[c,m]of s){let u=c.toLowerCase().trim(),d=document.createElement("tool-tip");d.text=`${r.name}/${c}`,d.setAttribute("data-searchable-name",`${i}/${u}`);let l=document.createElement("texture-loader");l.dataSource=o,l.item=m,d.addEventListener("click",()=>{F(o,m)}),d.append(l),n.append(d)}}let a=document.querySelector("#textures");a.innerHTML="",a.append(n)}function S(o){let t=[];for(let[e,n]of o.subfolders){let a=S(n);t.push(...a),t.push({name:e,items:n.items})}return t}async function D(){let o=window.location.hash.split("/");o[0]==="#github"&&o[1]&&o[2]&&o[3]&&await g(new p(o[1],o[2],o[3],""))}function $(){let o=document.querySelector("#search");o.addEventListener("input",()=>{let t=o.value.toLowerCase();document.querySelectorAll("[data-searchable-name]").forEach(n=>{if(!(n instanceof HTMLElement))return;let r=n.getAttribute("data-searchable-name")?.toLowerCase()?.includes(t);n.style.display=r?"block":"none"})}),document.addEventListener("keydown",t=>{(t.key==="/"||(t.metaKey||t.ctrlKey)&&t.key==="f")&&(t.preventDefault(),o.focus())})}var x=class{constructor(t){this.directory=t}getNavBarClass(){return"local"}addDescriptionToNav(t){let e=document.createElement("div");e.innerText=this.directory.name;let n=document.createElement("div");n.innerText="Local",t.append(e),t.append(n)}async getRootFolder(){return this.loadFoldersRecursively(this.directory,"")}async loadItem(t){let{imageHandle:e,mcMetaHandle:n}=await this.findImageAndMcMeta(t),a=await this.loadImage(e),r=await this.loadMcMeta(n,t.mcMetaPath,a);return{image:a,animation:r}}async loadFoldersRecursively(t,e){let n=f(),a=/(.*)\.png(\.mcmeta)?/;for await(let[r,i]of t.entries()){if(i.kind==="directory"){let l=await this.loadFoldersRecursively(i,`${e}/${r}`);n.subfolders.set(r,l);continue}let s=r.match(a);if(!s)continue;let[,c,m]=s,u=m!=null;(!n.items.has(r)||u)&&n.items.set(c,{imagePath:`${e}/${c}.png`,mcMetaPath:u?`${e}/${c}.png.mcmeta`:void 0})}return n}async findImageAndMcMeta(t){let e=t.imagePath.slice(1).split("/"),n=this.directory;for(let s of e.slice(0,-1))n=await n.getDirectoryHandle(s);let a=e.at(-1);if(!a)throw new Error("Couldn't find item");let r=await n.getFileHandle(a),i;return t.mcMetaPath&&(i=await n.getFileHandle(`${a}.mcmeta`)),{imageHandle:r,mcMetaHandle:i}}async loadImage(t){return new Promise(async e=>{let n=await t.getFile(),a=new FileReader;a.addEventListener("load",()=>{let r=new Image;r.src=a.result,e(r)}),a.readAsDataURL(n)})}async loadMcMeta(t,e,n){if(!t)return;let a;try{a=await(await t.getFile()).text();let i=JSON.parse(a);return v(i,n)}catch(r){console.error(`Couldn't load ${e}:`,r,a)}}};function H(){let o=document.querySelector("#dataSourceMenuOpenItems"),t=document.createElement("div");t.addEventListener("click",X),t.innerText="Open from GitHub";let e=document.createElement("div");e.addEventListener("click",U),e.innerText="Open from your computer",o.append(t),o.append(e)}async function X(){let o=prompt("Enter the URL to a GitHub repo, and we'll find the textures in it:");if(!o)return;let t=o.match(/^(https?:\/\/)?github\.com\/([^\/]+)\/([^\/]+)/);if(!t)return;let[,,e,n]=t,a=`https://api.github.com/repos/${e}/${n}`,r=await fetch(a),{default_branch:i}=await r.json();window.location.hash=`github/${e}/${n}/${i}`,g(new p(e,n,i,""))}async function U(){if(!window.showDirectoryPicker){alert("Your browser does not support selecting directories. Try Chrome.");return}let o=await window.showDirectoryPicker();window.location.hash="",g(new x(o))}window.addEventListener("load",async()=>{H(),$(),L(),await D()});window.customElements.define("animated-texture",E);window.customElements.define("texture-loader",b);window.customElements.define("tool-tip",y);})();