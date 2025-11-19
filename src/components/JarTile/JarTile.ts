import templateHtml from "./JarTile.html?raw";
import { defineCustomElt, queryElt } from "../componentUtils";
import { SideLabel } from "../SideLabel/SideLabel";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import {
  ColorChangeEvent,
  colorControlEvents,
} from "../ColorControls/ColorControls";
import {
  RangeChangeEvent,
  rangeEvents,
  VerticalRange,
} from "../VerticalRange/VerticalRange";
import { colors, Container, HexColorValue } from "../../api";
import { ComplexComponent } from "../../interfaces/ComplexComponent";

export const selectors = {
  labelInput: ".label-input",
  colors: [".colors-left", ".colors-right"],
  ranges: [".range-left", ".range-right"],
  labels: [".label-left", ".label-right"],
  removeBtn: ".remove-btn",
  jarIllustration: ".jar-illustration",
};

export interface JarTileProps {
  container: Container;
}

export const defaultJarTileProps: Container = {
  id: Symbol("Default JarTile"),
  containerLabel: "New Jar",
  categories: [
    {
      categoryLabel: "G",
      hexColor: colors.maybe,
      percent: 50,
    },
    {
      categoryLabel: "R",
      hexColor: colors.maybe,
      percent: 50,
    },
  ],
};

export class JarTile
  extends HTMLElement
  implements ComplexComponent<JarTileProps>
{
  private container = defaultJarTileProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.setupEventListeners();

    this.drawJar();
  }

  setProps(props: JarTileProps) {
    this.container = props.container;

    this.updateContainerLabelElt(props.container.containerLabel);
    props.container.categories.forEach((category, i) => {
      this.updateColor(i, category.hexColor);
      this.updateRange(i, category.percent);
      this.updateCategoryLabel(i, category.categoryLabel);
    });

    this.drawJar();
  }

  export(): Container {
    return this.container;
  }

  private setupEventListeners() {
    this.handleRemove();
    this.handleColorChanges();
    this.handleFillChanges();
    this.handleLabelChanges();
  }

  private updateColor(categoryIdx: number, color?: string) {
    if (!color) {
      console.warn("JarTile: Updating color failed. No color found", color);
      return;
    }
    this.container.categories[categoryIdx].hexColor = color as HexColorValue;
    this.updateCategoryElt(selectors.labels[categoryIdx], color);
    this.drawJar();
  }

  private updateRange(categoryIdx: number, rangeValue?: number) {
    if (rangeValue === undefined) {
      console.warn("Updating range failed. No range found", rangeValue);
      return;
    }

    this.container.categories[categoryIdx].percent = rangeValue;
    this.updateRangeElt(selectors.ranges[categoryIdx], rangeValue);
    this.drawJar();
  }

  private updateCategoryLabel(categoryIdx: number, text: string) {
    const selector = selectors.labels[categoryIdx];
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      return;
    }
    sideLabel.label = text;
  }

  private updateContainerLabelElt(text: string) {
    const labelElt = queryElt<HTMLTextAreaElement>(
      this.shadowRoot,
      selectors.labelInput,
    );
    if (!labelElt) {
      console.warn("JarTile: No label elt found");
      return;
    }
    labelElt.value = text;
    this.container.containerLabel = text;
  }

  private updateCategoryElt(selector: string, color: string) {
    const sideLabel = queryElt<SideLabel>(this.shadowRoot, selector);

    if (!sideLabel) {
      console.warn("JarTile: No sidelabel elt found!", { selector, color });
      return;
    }
    sideLabel.color = color;
  }

  private updateRangeElt(selector: string, level: number) {
    const rangeElt = queryElt<VerticalRange>(this.shadowRoot, selector);

    if (!rangeElt) {
      return;
    }

    rangeElt.rangevalue = level;
  }

  private handleLabelChanges = () => {
    const labelElt = queryElt<HTMLTextAreaElement>(
      this.shadowRoot,
      selectors.labelInput,
    );
    labelElt?.addEventListener("input", (e) => {
      const newLabel = (e.target as HTMLInputElement).value;
      this.updateContainerLabelElt(newLabel);
    });
  };

  private handleFillChanges = () => {
    selectors.ranges.forEach((rangeSelector, i) => {
      const rangeElt = queryElt(this.shadowRoot, rangeSelector);

      if (!rangeElt) {
        console.warn("Error setting range events. Element(s) not found", {
          rangeElt,
          i,
          rangeSelector,
        });
        return;
      }
      handleCustomEvent<CustomEventInit<RangeChangeEvent>>(
        rangeElt,
        rangeEvents.rangechange,
        (detail) => this.updateRange(i, detail?.value),
      );
    });
  };

  private handleColorChanges = () => {
    selectors.colors.forEach((colorSelector, i) => {
      const colorElt = queryElt(this.shadowRoot, colorSelector);

      if (!colorElt) {
        console.warn("Error setting color events. Element(s) not found", {
          colorElt,
          i,
          colorSelector,
        });
        return;
      }

      handleCustomEvent<CustomEventInit<ColorChangeEvent>>(
        colorElt,
        colorControlEvents.colorchange,
        (detail) => {
          this.updateColor(i, detail?.color);
        },
      );
    });
  };

  private drawJar() {
    const jarIllustrationElt = queryElt<JarIllustration>(
      this.shadowRoot,
      selectors.jarIllustration,
    );

    if (!jarIllustrationElt) {
      console.warn("No jar illustration yet");
      return;
    }

    jarIllustrationElt.colorleft = this.container.categories[0].hexColor;
    jarIllustrationElt.colorright = this.container.categories[1].hexColor;
    jarIllustrationElt.fillleft = this.container.categories[0].percent;
    jarIllustrationElt.fillright = this.container.categories[1].percent;
  }

  private handleRemove() {
    const removeBtn = queryElt(this.shadowRoot, selectors.removeBtn)!;
    removeBtn.addEventListener("click", () => this.remove());
  }
}

function handleCustomEvent<T extends CustomEventInit>(
  elt: Element,
  eventName: string,
  cb: (detail: T["detail"]) => void,
) {
  elt.addEventListener(eventName, (e: T) => cb(e.detail));
}

export const jarTileTag = "jar-tile";
defineCustomElt(jarTileTag, JarTile);
