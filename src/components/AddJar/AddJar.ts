import templateHtml from "./AddJar.html?raw";
import { defineCustomElt, queryElt } from "../utils";
import { defaultJarAttrs } from "../jarAttrs";
import { createJars } from "../../utils";

export const selectors = {
  addJar: ".add-jar",
};
export class AddJar extends HTMLElement {
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

export const addJarTag = "add-jar";
defineCustomElt(addJarTag, AddJar);
