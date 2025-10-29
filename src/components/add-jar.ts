import { createJars } from "../utils";
import templateHtml from "bundle-text:./add-jar.html";
import { defineCustomElt, queryElt } from "./utils";
import { defaultJarAttrs } from "./jarIllustration/jarAttrs";

const selectors = {
  addJar: ".add-jar",
};
class AddJar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.createAddJarListener();
  }

  private createAddJarListener() {
    const addJarButton = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.addJar,
    );

    if (!addJarButton) return;

    addJarButton.addEventListener("click", () => {
      createJars([defaultJarAttrs]);
    });
  }
}

defineCustomElt("add-jar", AddJar);
