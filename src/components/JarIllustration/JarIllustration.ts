import templateHtml from "./JarIllustration.html?raw";
import { defineCustomElt, mapPropertiesToAttribute, queryElt } from "../utils";
import { paintJar } from "./jarCanvasUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";

export const selectors = {
  jarCanvas: ".jar",
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
  fillleft = defaultJarTileProps.fillleft;
  fillright = defaultJarTileProps.fillright;

  colorleft = defaultJarTileProps.colorleft;
  colorright = defaultJarTileProps.colorright;

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
    const canvas = queryElt<HTMLCanvasElement>(
      this.shadowRoot,
      selectors.jarCanvas,
    );

    if (!canvas) {
      return;
    }

    paintJar(
      canvas,
      +this.fillleft,
      this.colorleft,
      +this.fillright,
      this.colorright,
    );
  }
}

export const jarIllustrationTag = "jar-illustration";
defineCustomElt(jarIllustrationTag, JarIllustration);
