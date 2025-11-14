import { describe, it, expect } from "vitest";
import { JarTile, jarTileTag, selectors } from "./JarTile";
import { defineCustomElt } from "../utils";
import { SideLabel, sideLabelTag } from "../SideLabel/SideLabel";
import { JarIllustration } from "../JarIllustration/JarIllustration";
import { colorControlEvents } from "../ColorControls/ColorControls";
import { rangeEvents } from "../VerticalRange/VerticalRange";
import { queryTestElement, renderComponent } from "../../test/testUtils";
import { colors, Container, HexColorValue } from "../../api";
import userEvent from "@testing-library/user-event";

defineCustomElt(jarTileTag, JarTile);

const renderJarTile = () => renderComponent<JarTile>(jarTileTag);

const exampleContainer: Container = {
  id: Symbol(),
  containerLabel: "init render test",
  categories: [
    {
      categoryLabel: "MF",
      hexColor: colors.yes,
      percent: 28,
    },
    {
      categoryLabel: "ON",
      hexColor: colors.no,
      percent: 92,
    },
  ],
};

const getJarIllustration = (component: JarTile) => {
  return queryTestElement<JarIllustration>(
    component,
    selectors.jarIllustration,
  );
};

describe("<jar-tile>", () => {
  describe("initial rendering", () => {
    it("renders with default values", () => {
      const component = renderJarTile();
      const jarIllustration = getJarIllustration(component);

      component.setProps({ container: exampleContainer });

      const exportedProps = component.export();

      expect(exportedProps).toEqual(exampleContainer);
      expect(jarIllustration).toBeTruthy();
    });

    it("propagates initial fill values to jar illustration", () => {
      const component = renderJarTile();
      component.setProps({ container: exampleContainer });

      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.fillleft).toBe(
        exampleContainer.categories[0].percent,
      );
      expect(jarIllustration.fillright).toBe(
        exampleContainer.categories[1].percent,
      );
    });

    it("propagates initial color values to jar illustration", () => {
      const component = renderJarTile();
      component.setProps({ container: exampleContainer });

      const jarIllustration = queryTestElement<JarIllustration>(
        component,
        selectors.jarIllustration,
      );

      expect(jarIllustration.colorleft).toBe(
        exampleContainer.categories[0].hexColor,
      );
      expect(jarIllustration.colorright).toBe(
        exampleContainer.categories[1].hexColor,
      );
    });

    it("propagates initial label values to side labels", () => {
      const component = renderJarTile();
      component.setProps({ container: exampleContainer });

      selectors.labels.forEach((selector, i) => {
        const labelElt = queryTestElement<SideLabel>(component, selector);
        expect(labelElt.label).toBe(
          exampleContainer.categories[i].categoryLabel,
        );
      });
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

  describe("colorchange event updates illustration and export", () => {
    it("updates colorleft when left color controls emit colorchange", () => {
      const component = renderJarTile();
      const colorLeft = queryTestElement(component, selectors.colors[0]);
      const newColor = "#aabbcc";
      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: { color: newColor },
      });
      colorLeft.dispatchEvent(event);

      const jarIllustration = getJarIllustration(component);

      expect(jarIllustration.colorleft).toBe(newColor);
      expect(component.export().categories[0].hexColor, newColor);
    });

    it("updates colorright when right color controls emit colorchange", () => {
      const component = renderJarTile();
      const colorRight = queryTestElement(component, selectors.colors[1]);
      const newColor = "#ffeecc";
      const event = new CustomEvent(colorControlEvents.colorchange, {
        detail: { color: newColor },
      });
      colorRight.dispatchEvent(event);

      const jarIllustration = getJarIllustration(component);

      expect(jarIllustration.colorright).toBe(newColor);
      expect(component.export().categories[1].hexColor, newColor);
    });

    it("empty color keeps previous color", () => {
      const component = renderJarTile();
      component.setProps({ container: exampleContainer });
      const colorLeft = queryTestElement(component, selectors.colors[0]);

      const event = new CustomEvent(colorControlEvents.colorchange, {});
      colorLeft.dispatchEvent(event);

      expect(component.export()).toEqual(exampleContainer);
    });
  });

  describe("rangechange event updates illustration and export", () => {
    it("updates fillleft when left range emits rangechange", () => {
      const component = renderJarTile();
      const rangeLeft = queryTestElement(component, selectors.ranges[0]);

      const event = new CustomEvent(rangeEvents.rangechange, {
        detail: { value: 45 },
      });
      rangeLeft.dispatchEvent(event);

      expect(component.export().categories[0].percent).toBe("45");
    });

    it("handles rangechange with zero value", () => {
      const component = renderJarTile();
      component.setProps({ container: exampleContainer });
      const rangeLeft = queryTestElement(component, selectors.ranges[1]);

      const event = new CustomEvent(rangeEvents.rangechange, {});
      rangeLeft.dispatchEvent(event);

      expect(component.export()).toEqual(exampleContainer);
    });
  });

  describe("updating container label", () => {
    it("exports the correct label", async () => {
      const updatedLabel = "horses r us";
      const user = userEvent.setup();
      const component = renderJarTile();
      const labelInput = queryTestElement(component, selectors.labelInput);

      await user.type(labelInput, updatedLabel);

      expect(component.export().containerLabel).toBe(updatedLabel);
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
});
