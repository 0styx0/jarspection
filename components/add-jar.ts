import { createFillableJar, createJars } from "../utils";
import templateHtml from "bundle-text:./add-jar.html";
import { defaultJarAttrs } from "./fillable-jar/jarAttrs";
import { defineCustomElt, queryElt } from "./utils";

class AddJar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.createAddJarListener();
  }

  private createAddJarListener() {
    const addJarButton = queryElt<HTMLDivElement>(this.shadowRoot, ".add-jar");

    if (!addJarButton) return;

    addJarButton.addEventListener("click", () => {
      createJars([defaultJarAttrs]);
    });
  }
}

defineCustomElt("add-jar", AddJar);
