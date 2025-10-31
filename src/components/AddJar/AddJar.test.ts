import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../utils";
import { defaultJarAttrs } from "../JarIllustration/jarAttrs";
import { createJars } from "../../utils";
import { AddJar, addJarTag, selectors } from "./AddJar";

vi.mock("../../utils", () => ({
  createJars: vi.fn(),
}));

defineCustomElt(addJarTag, AddJar);

function renderComponent() {
  const component = document.createElement(addJarTag) as AddJar;
  document.body.appendChild(component);
  return component;
}

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
      const component = renderComponent();
      const button = getButton(component);
      expect(button.textContent?.trim()).toBe("+");
    });
  });

  describe("interaction", () => {
    it("calls createJars with defaultJarAttrs when the button is clicked", () => {
      vi.clearAllMocks();
      const component = renderComponent();
      const button = getButton(component);

      button.click();

      expect(createJars).toHaveBeenCalledTimes(1);
      expect(createJars).toHaveBeenCalledWith([defaultJarAttrs]);
    });
  });
});
