import templateHtml from "./JarIllustration.html?raw";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { paintJar, paintLeftJar, paintRightJar } from "./jarCanvasUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";

export const selectors = {
  jarLeft: ".left-side .liquid",
  jarRight: ".right-side .liquid",
};

export type JarIllustrationProps = {
  colorleft: string;
  colorright: string;
  fillleft: number;
  fillright: number;
};

export class JarIllustration
  extends HTMLElement
  implements JarIllustrationProps
{
  fillleft = defaultJarTileProps.categories[0].percent;
  fillright = defaultJarTileProps.categories[1].percent;

  colorleft = defaultJarTileProps.categories[0].hexColor;
  colorright = defaultJarTileProps.categories[1].hexColor;

  static observedAttributes = [
    "fillleft",
    "fillright",
    "colorleft",
    "colorright",
  ];

  static mirroredProps = ["fillleft", "fillright", "colorleft", "colorright"];

  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    mapPropertiesToAttribute(this, JarIllustration.mirroredProps);

    this.drawJar();
  }

  attributeChangedCallback(attr: string, was: string, value: string) {
    if (was === value) return;

    this.drawJar();
  }

  private drawJar() {
    const leftJar = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.jarLeft,
    );
    const rightJar = queryElt<HTMLDivElement>(
      this.shadowRoot,
      selectors.jarRight,
    );

    if (!leftJar || !rightJar) {
      console.warn("JarIllustration: Unable to find jar half", {
        leftJar,
        rightJar,
      });
      return;
    }
    leftJar.style.backgroundColor = this.colorleft;
    leftJar.style.height = this.fillleft + "%";

    rightJar.style.backgroundColor = this.colorright;
    rightJar.style.height = this.fillright + "%";
  }
}

export const jarIllustrationTag = "jar-illustration";
defineCustomElt(jarIllustrationTag, JarIllustration);
