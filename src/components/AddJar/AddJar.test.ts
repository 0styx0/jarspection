import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../componentUtils";
import { createJars } from "../../utils";
import { AddJar, addJarTag, selectors } from "./AddJar";
import { renderComponent } from "../../test/testUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";

vi.mock("../../utils", () => ({
  createJars: vi.fn(),
}));

defineCustomElt(addJarTag, AddJar);

const renderAddJar = () => renderComponent<AddJar>(addJarTag);

const getButton = (component: AddJar) => {
  const button = component.shadowRoot?.querySelector<HTMLDivElement>(
    selectors.addJar,
  );
  expect(button).toBeTruthy();
  return button!;
};

describe("<add-jar>", () => {
  describe("initial render", () => {
    it("renders a button with a plus sign", () => {
      vi.clearAllMocks();
      const component = renderAddJar();
      const button = getButton(component);
      expect(button.textContent?.trim()).toBe("+");
    });
  });

  describe("interaction", () => {
    it("calls createJars with defaultJarAttrs when the button is clicked", () => {
      vi.clearAllMocks();
      const component = renderAddJar();
      const button = getButton(component);

      button.click();

      expect(createJars).toHaveBeenCalledTimes(1);
      expect(createJars).toHaveBeenCalledWith([defaultJarTileProps]);
    });
  });
});
