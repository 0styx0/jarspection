/**
  * Renders `jars` passed in via props.
  +
  * When a jar is created or deleted, calls props.setJars
  */

import templateHtml from "./JarGrid.html?raw";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { Container } from "../../api";
import { JarTile, JarTileProps, jarTileTag } from "../JarTile/JarTile";
import {
  createComplexComponent,
  defineCustomElt,
  queryElt,
  queryElts,
} from "../componentUtils";

export const selectors = {
  jarGrid: ".jarGrid",
  addJar: ".addJar",
  jarTiles: jarTileTag,
};

export interface JarGridProps {
  jars: Container[];
}

type JarTileMap = Map<Container["id"], JarTile>;

export class JarGrid
  extends HTMLElement
  implements ComplexComponent<JarGridProps>
{
  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  setProps(props: JarGridProps) {
    this.renderJars(props.jars);
  }

  getJars(): Map<Symbol, Container> {
    const jarTiles = queryElts<JarTile>(this.shadowRoot, selectors.jarTiles);
    return jarTiles.reduce((jars, curTile) => {
      const curJar = curTile.export();
      jars.set(curJar.id, curJar);
      return jars;
    }, new Map<Symbol, Container>());
  }

  private getJarTiles(): JarTileMap {
    const jarTiles = queryElts<JarTile>(this.shadowRoot, selectors.jarTiles);
    return jarTiles.reduce((jarTileMap, curTile) => {
      const jarId = curTile.export().id;
      jarTileMap.set(jarId, curTile);
      return jarTileMap;
    }, new Map() as JarTileMap);
  }

  /**
   * Adds any jars not in dom, to the dom
   * Updates jars in the dom to match `jars`
   * Removes jars in the dom but absent from `jars` from the dom
   */
  private renderJars(jars: Container[]): void {
    const currentJarTiles = this.getJarTiles();

    this.addNewJars(currentJarTiles, jars);
    this.removeDeletedJars(currentJarTiles, jars);
  }

  private addNewJars(currentJarTiles: JarTileMap, updatedJars: Container[]) {
    for (const updatedJar of updatedJars) {
      const curJar = currentJarTiles.get(updatedJar.id);
      if (!curJar) {
        this.appendJar(updatedJar);
      }
    }
  }

  private removeDeletedJars(
    currentJarTiles: JarTileMap,
    updatedJars: Container[],
  ) {
    const jarIds = getIdsAsSet(updatedJars);
    const removedJars = new Set(currentJarTiles.keys()).difference(jarIds);

    removedJars.forEach((jarId) => this.removeJar(currentJarTiles.get(jarId)!));
  }

  private appendJar(jar: Container): void {
    const jarGrid = queryElt(this.shadowRoot, selectors.jarGrid);

    const addJar = queryElt(this.shadowRoot, selectors.addJar);

    if (!jarGrid || !addJar) {
      console.error("JarGrid: Required elt not found", {
        jarGrid,
        addJar,
      });
      return;
    }

    const jarTileElt = createComplexComponent<JarTile, JarTileProps>(
      jarTileTag,
      {
        container: jar,
      },
    );

    jarGrid.insertBefore(jarTileElt, addJar);
  }

  private removeJar(jarTile: JarTile): void {
    jarTile.remove();
  }
}

function getIdsAsSet(jars: Container[]) {
  return jars.reduce((ids, curJar) => ids.add(curJar.id), new Set<Symbol>());
}

export const jarGridTag = "jar-grid";
defineCustomElt(jarGridTag, JarGrid);
