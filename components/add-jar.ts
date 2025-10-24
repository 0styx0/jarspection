import { createFillableJar } from "../utils";
import { FillableJar } from "./fillable-jar/fillable-jar";
import templateHtml from "bundle-text:./add-jar.html";

class AddJar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = templateHtml;

    this.createAddJarListener();
  }

  private createAddJarListener() {
    const addJarButton = document.querySelector("add-jar");

    addJarButton.addEventListener("click", () => {
      const newJar = createFillableJar({
        label: "New Jar",
      });

      this.parentNode.insertBefore(newJar, this);
    });
  }
}

customElements.define("add-jar", AddJar);
