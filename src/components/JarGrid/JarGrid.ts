/**
  * Renders `jars` passed in via props.
  +
  * When a jar is created or deleted, calls props.setJars
  */

import templateHtml from "./JarGrid.html?raw";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { JarTile, JarTileProps, jarTileTag } from "../JarTile/JarTile";
import {
  createComplexComponent,
  defineCustomElt,
  handleCustomEvent,
  queryElt,
  queryElts,
} from "../componentUtils";
import { TopicHolder } from "../../models/TopicHolder";
import { AddJarEvent, addJarEvents } from "../AddJar/AddJar";

export const selectors = {
  jarGrid: ".jarGrid",
  addJar: ".addJar",
  jarTiles: jarTileTag,
};

export interface JarGridProps {
  jars: TopicHolder[];
}

type TopicTileMap = Map<TopicHolder["metadata"]["id"], JarTile>;

export class JarGrid
  extends HTMLElement
  implements ComplexComponent<JarGridProps>
{
  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.createAddJarListener();
  }

  setProps(props: JarGridProps) {
    this.renderJars(props.jars);
  }

  exportTopics(): Map<string, TopicHolder> {
    const jarTiles = queryElts<JarTile>(this.shadowRoot, selectors.jarTiles);
    return jarTiles.reduce((jars, curTile) => {
      const curJar = curTile.export();
      jars.set(curJar.metadata.id, curJar);
      return jars;
    }, new Map<string, TopicHolder>());
  }

  private createAddJarListener() {
    const addJarElt = queryElt(this.shadowRoot, selectors.addJar);
    if (!addJarElt) {
      console.warn("Error setting addJar event. addJar not found");
      return;
    }

    handleCustomEvent<CustomEventInit<AddJarEvent>>(
      addJarElt,
      addJarEvents.addJar,
      (detail) => {
        this.insertJar(detail!.container)?.selectTopic();
      },
    );
  }

  private getTopicTiles(): TopicTileMap {
    const jarTiles = queryElts<JarTile>(this.shadowRoot, selectors.jarTiles);
    return jarTiles.reduce((jarTileMap, curTile) => {
      const jarId = curTile.export().metadata.id;
      jarTileMap.set(jarId, curTile);
      return jarTileMap;
    }, new Map() as TopicTileMap);
  }

  /**
   * Adds any jars not in dom, to the dom
   * Updates jars in the dom to match `jars`
   * Removes jars in the dom but absent from `jars` from the dom
   */
  private renderJars(jars: TopicHolder[]): void {
    const currentJarTiles = this.getTopicTiles();

    this.addNewJars(currentJarTiles, jars);
    this.removeDeletedJars(currentJarTiles, jars);
  }

  private addNewJars(
    currentJarTiles: TopicTileMap,
    updatedJars: TopicHolder[],
  ) {
    for (const updatedJar of updatedJars) {
      const curJar = currentJarTiles.get(updatedJar.metadata.id);
      if (!curJar) {
        this.insertJar(updatedJar);
      }
    }
  }

  private removeDeletedJars(
    currentJarTiles: TopicTileMap,
    updatedJars: TopicHolder[],
  ) {
    const jarIds = getIdsAsSet(updatedJars);
    const removedJars = new Set(currentJarTiles.keys()).difference(jarIds);

    removedJars.forEach((jarId) => this.removeJar(currentJarTiles.get(jarId)!));
  }

  /**
   * Inserts after current focused elt, or at grid end
   */
  private insertJar(jar: TopicHolder) {
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
        topic: jar,
        removeTile: () => this.removeJar(jarTileElt),
      },
    );

    if (isJarTile(this.shadowRoot?.activeElement)) {
      this.shadowRoot.activeElement.after(jarTileElt);
    } else {
      jarGrid.insertBefore(jarTileElt, addJar);
    }

    return jarTileElt;
  }

  private removeJar(jarTile: JarTile): void {
    const fallbackTile = getNextTile(jarTile);

    fallbackTile?.selectTopic();

    jarTile.remove();
  }
}

function getNextTile(curTile: JarTile) {
  const nextTile = curTile.previousSibling || curTile.nextSibling;
  return isJarTile(nextTile) ? nextTile : null;
}

function getIdsAsSet(jars: TopicHolder[]) {
  return jars.reduce(
    (ids, curJar) => ids.add(curJar.metadata.id),
    new Set<string>(),
  );
}

function isJarTile(elt?: ChildNode | Element | null): elt is JarTile {
  return elt?.nodeName === jarTileTag.toUpperCase();
}

export const jarGridTag = "jar-grid";
defineCustomElt(jarGridTag, JarGrid);
