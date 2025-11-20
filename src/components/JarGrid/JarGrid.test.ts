import { describe, it, test, expect, vi } from "vitest";
import { JarGrid, jarGridTag, selectors } from "./JarGrid";
import { defineCustomElt } from "../componentUtils";
import { JarTile, jarTileTag } from "../JarTile/JarTile";
import {
  queryTestElement,
  queryTestElements,
  renderComponent,
} from "../../test/testUtils";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { Container } from "../../models/Container";
import { addJarEvents } from "../AddJar/AddJar";

defineCustomElt(jarGridTag, JarGrid);
defineCustomElt(jarTileTag, JarTile);

const renderJarGrid = () => renderComponent<JarGrid>(jarGridTag);

const createExampleContainer = (label: string) => {
  const cont = new Container();
  cont.containerLabel = label;
  return cont;
};

// setProps takes an animationframe to complete
function setComplexPropsTest<P>(component: ComplexComponent<P>, props: P) {
  vi.useFakeTimers();
  component.setProps(props);
  vi.advanceTimersToNextFrame();
}

const exampleJars: Container[] = [
  createExampleContainer("Jar 1"),
  createExampleContainer("Jar 2"),
  createExampleContainer("Jar 3"),
];

describe("<jar-grid>", () => {
  describe("renders", () => {
    it("passed-in jars", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const jarTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );

      expect(jarTiles.length).toBe(exampleJars.length);

      jarTiles.forEach((tile, index) => {
        const exported = tile.export();
        expect(exported.id).toBe(exampleJars[index].id);
        expect(exported.containerLabel).toBe(exampleJars[index].containerLabel);
      });
    });

    it("add-jar", () => {
      const component = renderJarGrid();
      const addJarBtn = queryTestElement(component, selectors.addJar);

      expect(addJarBtn).toBeTruthy();
    });

    it("renders empty grid with no jars", () => {
      const component = renderJarGrid();
      component.setProps({ jars: [] });

      const jarTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );

      expect(jarTiles.length).toBe(0);
    });
  });

  describe("clicking add jars", () => {
    test("adds jar to the dom", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const initialTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );
      expect(initialTiles.length).toBe(3);

      const newJar = createExampleContainer("Jar 4");
      component.setProps({ jars: [...exampleJars, newJar] });

      const updatedTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );
      expect(updatedTiles.length).toBe(4);
    });

    test("allows getJars to return the new jar", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const newJar = createExampleContainer("Jar 4");
      setComplexPropsTest(component, { jars: [...exampleJars, newJar] });

      const jarsMap = component.getJars();

      expect(jarsMap.size).toBe(4);
      expect(jarsMap.has(newJar.id)).toBe(true);
      expect(jarsMap.get(newJar.id)?.containerLabel).toBe("Jar 4");
    });

    test("preserves order with add-jar button at the end", () => {
      const component = renderJarGrid();
      const addJarBtn = queryTestElement(component, selectors.addJar);

      component.setProps({ jars: exampleJars });

      const jarGrid = queryTestElement(component, selectors.jarGrid);
      const lastChild = jarGrid.lastElementChild;

      expect(lastChild).toBe(addJarBtn);
    });
  });

  describe("removing jars", () => {
    test("removes jar from the dom", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const initialTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );
      expect(initialTiles.length).toBe(3);

      const remainingJars = exampleJars.slice(1);
      setComplexPropsTest(component, { jars: remainingJars });

      const updatedTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );
      expect(updatedTiles.length).toBe(2);
    });

    test("makes getJars avoid returning the deleted jar", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const removedJarId = exampleJars[0].id;
      const remainingJars = exampleJars.slice(1);
      setComplexPropsTest(component, { jars: remainingJars });

      const jarsMap = component.getJars();

      expect(jarsMap.size).toBe(2);
      expect(jarsMap.has(removedJarId)).toBe(false);
    });

    test("removes multiple jars", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const remainingJars = [exampleJars[1]];
      setComplexPropsTest(component, { jars: remainingJars });

      const jarsMap = component.getJars();

      expect(jarsMap.size).toBe(1);
      expect(jarsMap.has(exampleJars[1].id)).toBe(true);
    });

    test("removes all jars", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      setComplexPropsTest(component, { jars: [] });

      const jarsMap = component.getJars();
      const jarTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );

      expect(jarsMap.size).toBe(0);
      expect(jarTiles.length).toBe(0);
    });
  });

  describe("rendering twice", () => {
    test("overwrites the existing jars with the new props", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const newJars: Container[] = [
        createExampleContainer("New Jar 1"),
        createExampleContainer("New Jar 2"),
      ];

      setComplexPropsTest(component, { jars: newJars });

      const jarsMap = component.getJars();
      const jarTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );

      expect(jarTiles.length).toBe(2);
      expect(jarsMap.size).toBe(2);

      // Verify old jars are gone
      exampleJars.forEach((oldJar) => {
        expect(jarsMap.has(oldJar.id)).toBe(false);
      });

      // Verify new jars are present
      newJars.forEach((newJar) => {
        expect(jarsMap.has(newJar.id)).toBe(true);
      });
    });

    test("preserves jars that exist in both renders", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const preservedJar = exampleJars[1];
      const newJar = createExampleContainer("New Jar");
      const updatedJars = [preservedJar, newJar];

      setComplexPropsTest(component, { jars: updatedJars });

      const jarsMap = component.getJars();
      const jarTiles = queryTestElements<JarTile>(
        component,
        selectors.jarTiles,
      );

      expect(jarTiles.length).toBe(2);
      expect(jarsMap.has(preservedJar.id)).toBe(true);
      expect(jarsMap.has(newJar.id)).toBe(true);
      expect(jarsMap.has(exampleJars[0].id)).toBe(false);
    });

    test("handles complex add/remove operations", () => {
      const component = renderJarGrid();

      // First render
      setComplexPropsTest(component, { jars: exampleJars });
      expect(component.getJars().size).toBe(3);

      // Second render: remove one, keep two
      const secondRender = [exampleJars[0], exampleJars[2]];
      setComplexPropsTest(component, { jars: secondRender });
      expect(component.getJars().size).toBe(2);

      // Third render: add new ones, keep one old one
      const newJar1 = createExampleContainer("Brand New 1");
      const newJar2 = createExampleContainer("Brand New 2");
      const thirdRender = [exampleJars[0], newJar1, newJar2];
      setComplexPropsTest(component, { jars: thirdRender });

      const finalJarsMap = component.getJars();

      expect(finalJarsMap.size).toBe(3);
      expect(finalJarsMap.has(exampleJars[0].id)).toBe(true);
      expect(finalJarsMap.has(newJar1.id)).toBe(true);
      expect(finalJarsMap.has(newJar2.id)).toBe(true);
      expect(finalJarsMap.has(exampleJars[2].id)).toBe(false);
    });
  });

  describe("getJars", () => {
    test("returns empty map for no jars", () => {
      const component = renderJarGrid();
      component.setProps({ jars: [] });

      const jarsMap = component.getJars();

      expect(jarsMap.size).toBe(0);
      expect(jarsMap instanceof Map).toBe(true);
    });

    test("returns correct jar data", () => {
      const component = renderJarGrid();
      setComplexPropsTest(component, { jars: exampleJars });

      const jarsMap = component.getJars();

      exampleJars.forEach((jar) => {
        const retrievedJar = jarsMap.get(jar.id);
        expect(retrievedJar).toBeTruthy();
        expect(retrievedJar?.containerLabel).toBe(jar.containerLabel);
        expect(retrievedJar?.categories.length).toBe(jar.categories.length);
      });
    });
  });

  describe("addJar event", () => {
    it("adds jar to the grid", () => {
      const component = renderJarGrid();
      component.setProps({ jars: [] });
      const addJarElt = queryTestElement(component, selectors.addJar);

      const newContainer = new Container().setId('my new wonderful id').setContainerLabel('chips')
      const event = new CustomEvent(addJarEvents.addJar, {
        detail: { container: newContainer },
      });
      addJarElt.dispatchEvent(event);

      vi.advanceTimersToNextFrame();
      expect(component.getJars().get(newContainer.id)).toEqual(newContainer);
    });
  });
});
