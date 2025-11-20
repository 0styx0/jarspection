import { describe, it, expect, vi } from "vitest";
import { defineCustomElt } from "../componentUtils";
import {
  AddJar,
  AddJarEvent,
  addJarEvents,
  addJarTag,
  selectors,
} from "./AddJar";
import { renderComponent } from "../../test/testUtils";
import { defaultJarTileProps } from "../JarTile/JarTile";
import { Container } from "../../models/Container";

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
      const component = renderAddJar();
      const button = getButton(component);
      expect(button.textContent?.trim()).toBe("+");
    });
  });

  describe("click", () => {
    it("fires addJar event with a new jar", () => {
      const component = renderAddJar();
      const button = getButton(component);

      let emittedContainer = null;
      component.addEventListener(addJarEvents.addJar, (e: Event) => {
        emittedContainer = (e as CustomEvent<AddJarEvent>).detail.container;
      });
      button.click();

      expect(emittedContainer).toBeInstanceOf(Container);
    });
  });
});
