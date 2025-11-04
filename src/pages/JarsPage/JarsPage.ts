import templateHtml from "./JarsPage.html?raw";
import { defineCustomElt, queryElt } from "../../components/utils";
import { defaultContainers } from "../../defaultJars";
import {
  defaultJarTileProps,
  JarTile,
  JarTileProps,
  jarTileTag,
} from "../../components/JarTile/JarTile";
import { Container } from "../../api";
import { renderComponent } from "../../test/testUtils";

export const selectors = {
  jarGrid: ".jarGrid",
  addJar: ".addJar",
};

class JarsPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.createJars(defaultContainers);
  }

  private createJars(jars: Container[]) {
    const jarGrid = queryElt(this.shadowRoot, selectors.jarGrid);
    const addJar = queryElt(this.shadowRoot, selectors.addJar);

    if (!jarGrid || !addJar) {
      console.error("JarsPage: Required elt not found", {
        jarGrid,
        addJar,
      });
      return;
    }

    const jarElts = createJarElts(jars);

    jarGrid.insertBefore(jarElts, addJar);
  }
}

function createJarElts(containers: Container[]) {
  const fragment = document.createDocumentFragment();

  containers.forEach((container) => {
    const newJar = createFillableJar(container);

    fragment.appendChild(newJar);
  });
  return fragment;
}

// todo: use template instead?
function createFillableJar(container: Container) {
  const jar = document.createElement(jarTileTag) as JarTile;

  requestAnimationFrame(() => {
    jar.label = container.containerLabel;

    jar.fillleft = container.categories[0].percent;
    jar.fillright = container.categories[1].percent;

    jar.colorleft = container.categories[0].hexColor;
    jar.colorright = container.categories[1].hexColor;

    jar.labelleft = container.categories[0].categoryLabel;
    jar.labelright = container.categories[1].categoryLabel;
  });
  return jar;
}

export const jarsPageTag = "jars-page";
defineCustomElt(jarsPageTag, JarsPage);
