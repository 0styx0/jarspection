import templateHtml from "./AddJar.html?raw";
import { defineCustomElt, queryElt } from "../utils";
import { defaultJarAttrs } from "../JarIllustration/jarAttrs";
import { createJars } from "../../utils";

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
