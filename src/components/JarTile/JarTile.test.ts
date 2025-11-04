import { describe, it, expect } from "vitest";
import {
  defaultJarTileProps,
  JarTile,
  JarTileProps,
  jarTileTag,
  selectors,
} from "./JarTile";
import { defineCustomElt } from "../utils";
import { SideLabel } from "../SideLabel/SideLabel";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import { colorControlEvents } from "../ColorControls/ColorControls";
import { rangeEvents } from "../VerticalRange/VerticalRange";
import { queryTestElement, renderComponent } from "../../test/testUtils";
import { Container, HexColorValue } from "../../api";

defineCustomElt(jarTileTag, JarTile);

const renderJarTile = (attrs: Partial<JarTile> = {}) =>
  renderComponent<JarTile>(jarTileTag, attrs);

describe("<jar-tile>", () => {
  describe("initial rendering", () => {
    it("renders with default values", () => {
      const component = renderJarTile();
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(component.fillleft).toBe(
        defaultJarTileProps.categories[0].percent,
      );
      expect(component.fillright).toBe(
        defaultJarTileProps.categories[1].percent,
      );
      expect(component.colorleft).toBeTruthy();
      expect(component.colorright).toBeTruthy();
      expect(jarIllustration).toBeTruthy();
    });

    it("renders with custom initial values", () => {
      const component = renderJarTile({
        fillleft: 50,
        fillright: 75,
        colorleft: "#ff0000",
        colorright: "#00ff00",
        labelleft: "Left Label",
        labelright: "Right Label",
      });

      expect(component.fillleft).toBe("50");
      expect(component.fillright).toBe("75");
      expect(component.colorleft).toBe("#ff0000");
      expect(component.colorright).toBe("#00ff00");
      expect(component.labelleft).toBe("Left Label");
      expect(component.labelright).toBe("Right Label");
    });

    it("propagates initial fill values to jar illustration", () => {
      const component = renderJarTile({
        fillleft: 30,
        fillright: 60,
      });
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.fillleft).toBe("30");
      expect(jarIllustration.fillright).toBe("60");
    });

    it("propagates initial color values to jar illustration", () => {
      const component = renderJarTile({
        colorleft: "#123456",
        colorright: "#abcdef",
      });
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.colorleft).toBe("#123456");
      expect(jarIllustration.colorright).toBe("#abcdef");
    });

    it("propagates initial label values to side labels", () => {
      const component = renderJarTile({
        labelleft: "Test Left",
        labelright: "Test Right",
      });
      const labelLeft = queryTestElement<SideLabel>(
        component,
        selectors.labelLeft,
      );
      const labelRight = queryTestElement<SideLabel>(
        component,
        selectors.labelRight,
      );

      expect(labelLeft.getAttribute("label")).toBe("Test Left");
      expect(labelRight.getAttribute("label")).toBe("Test Right");
    });

    it("renders label textarea", () => {
      const component = renderJarTile();
      const labelInput = queryTestElement<HTMLTextAreaElement>(
        component,
        selectors.labelInput,
      );

      expect(labelInput.tagName).toBe("TEXTAREA");
      expect(labelInput.value).toBe("");
    });

    it("renders remove button", () => {
      const component = renderJarTile();
      const removeBtn = queryTestElement(component, selectors.removeBtn);

      expect(removeBtn.textContent).toBe("×");
    });
  });

  describe("property setters", () => {
    it("updates fillleft and propagates to jar illustration", () => {
      const component = renderJarTile();
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      component.fillleft = 80;

      expect(component.fillleft).toBe("80");
      expect(jarIllustration.fillleft).toBe("80");
    });

    it("updates fillright and propagates to jar illustration", () => {
      const component = renderJarTile();
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      component.fillright = 90;

      expect(component.fillright).toBe("90");
      expect(jarIllustration.fillright).toBe("90");
    });

    it("updates colorleft and propagates to jar illustration and side label", () => {
      const component = renderJarTile();
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );
      const labelLeft = queryTestElement<SideLabel>(
        component,
        selectors.labelLeft,
      );

      component.colorleft = "#ff00ff";

      expect(component.colorleft).toBe("#ff00ff");
      expect(jarIllustration.colorleft).toBe("#ff00ff");
      expect(labelLeft.color).toBe("#ff00ff");
    });

    it("updates colorright and propagates to jar illustration and side label", () => {
      const component = renderJarTile();
      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );
      const labelRight = queryTestElement<SideLabel>(
        component,
        selectors.labelRight,
      );

      component.colorright = "#00ffff";

      expect(component.colorright).toBe("#00ffff");
      expect(jarIllustration.colorright).toBe("#00ffff");
      expect(labelRight.color).toBe("#00ffff");
    });

    it("updates labelleft property", () => {
      const component = renderJarTile();
      const leftLabelElt = queryTestElement<SideLabel>(
        component,
        selectors.labelLeft,
      );
      const newLabel = "new left lab";

      component.labelleft = newLabel;

      expect(leftLabelElt.label).toBe(newLabel);
    });

    it("updates labelright property", () => {
      const component = renderJarTile();
      const rightLabelElt = queryTestElement<SideLabel>(
        component,
        selectors.labelRight,
      );
      const newLabel = "new right lab";

      component.labelright = newLabel;

      expect(rightLabelElt.label).toBe(newLabel);
    });

    it("updates label property", () => {
      const component = renderJarTile();
      const labelInput = queryTestElement<HTMLTextAreaElement>(
        component,
        selectors.labelInput,
      );

      component.label = "New Label";

      expect(component.label).toBe("New Label");
      expect(labelInput.value).toBe("New Label");
    });
  });

  describe("attribute changes", () => {
    it("updates label via setAttribute", () => {
      const component = renderJarTile();

      component.setAttribute("label", "Attribute Label");

      expect(component.label).toBe("Attribute Label");
    });

    it("updates colorleft via setAttribute and propagates to side label", () => {
      const component = renderJarTile();
      const labelLeft = queryTestElement<SideLabel>(
        component,
        selectors.labelLeft,
      );

      component.setAttribute("colorleft", "#112233");

      expect(component.colorleft).toBe("#112233");
      expect(labelLeft.color).toBe("#112233");
    });

    it("updates colorright via setAttribute and propagates to side label", () => {
      const component = renderJarTile();
      const labelRight = queryTestElement<SideLabel>(
        component,
        selectors.labelRight,
      );

      component.setAttribute("colorright", "#445566");

      expect(component.colorright).toBe("#445566");
      expect(labelRight.color).toBe("#445566");
    });
  });

  describe("event handling - colorchange", () => {
    it("updates colorleft when left color controls emit colorchange", () => {
      const component = renderJarTile();
      const colorLeft = queryTestElement(component, selectors.colorLeft);

      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: { color: "#aabbcc" },
      });
      colorLeft.dispatchEvent(event);

      expect(component.colorleft).toBe("#aabbcc");
    });

    it("updates colorright when right color controls emit colorchange", () => {
      const component = renderJarTile();
      const colorRight = queryTestElement(component, selectors.colorRight);

      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: { color: "#ddeeff" },
      });
      colorRight.dispatchEvent(event);

      expect(component.colorright).toBe("#ddeeff");
    });

    it("handles colorchange with empty color", () => {
      const component = renderJarTile({ colorleft: "#000000" });
      const colorLeft = queryTestElement(component, selectors.colorLeft);

      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: { color: "" },
      });
      colorLeft.dispatchEvent(event);

      expect(component.colorleft).toBe("");
    });

    it("handles colorchange with undefined detail", () => {
      const component = renderJarTile({ colorleft: "#000000" });
      const colorLeft = queryTestElement(component, selectors.colorLeft);

      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: undefined,
      });
      colorLeft.dispatchEvent(event);

      expect(component.colorleft).toBe("");
    });
  });

  describe("event handling - rangechange", () => {
    it("updates fillleft when left range emits rangechange", () => {
      const component = renderJarTile();
      const rangeLeft = queryTestElement(component, selectors.rangeLeft);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: { value: 45 },
      });
      rangeLeft.dispatchEvent(event);

      expect(component.fillleft).toBe("45");
    });

    it("updates fillright when right range emits rangechange", () => {
      const component = renderJarTile();
      const rangeRight = queryTestElement(component, selectors.rangeRight);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: { value: 85 },
      });
      rangeRight.dispatchEvent(event);

      expect(component.fillright).toBe("85");
    });

    it("handles rangechange with zero value", () => {
      const component = renderJarTile({ fillleft: 50 });
      const rangeLeft = queryTestElement(component, selectors.rangeLeft);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: { value: 0 },
      });
      rangeLeft.dispatchEvent(event);

      expect(component.fillleft).toBe("0");
    });

    it("handles rangechange with undefined detail", () => {
      const component = renderJarTile({ fillleft: 50 });
      const rangeLeft = queryTestElement(component, selectors.rangeLeft);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: undefined,
      });
      rangeLeft.dispatchEvent(event);

      expect(component.fillleft).toBe("0");
    });
  });

  describe("remove functionality", () => {
    it("removes component when remove button is clicked", () => {
      const component = renderJarTile();
      const removeBtn = queryTestElement<HTMLButtonElement>(
        component,
        selectors.removeBtn,
      );

      expect(document.body.contains(component)).toBe(true);

      removeBtn.click();

      expect(document.body.contains(component)).toBe(false);
    });
  });

  describe("export", () => {
    it("returns all properties", () => {
      const attrs: JarTileProps = {
        fillleft: 39,
        fillright: 30,
        colorleft: "#ffdd44",
        colorright: "#ffdd44",
        label: "eeeeeh",
        labelleft: "lefty",
        labelright: "righty-o",
      };

      const component = renderJarTile(attrs);
      const exported = component.export();

      expect(exported).toEqual({
        containerLabel: attrs.label,
        categories: [
          {
            categoryLabel: attrs.labelleft,
            hexColor: attrs.colorleft,
            percent: attrs.fillleft,
          },
          {
            categoryLabel: attrs.labelright,
            hexColor: attrs.colorright,
            percent: attrs.fillright,
          },
        ],
      } as Container);
    });
  });
});
