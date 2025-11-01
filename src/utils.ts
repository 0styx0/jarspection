import {
  defaultJarTileProps,
  JarTile,
  JarTileProps,
  jarTileTag,
} from "./components/JarTile/JarTile.js";
import { queryElt } from "./components/utils.js";

const selectors = {
  jarGrid: "#jarGrid",
  addJar: "#addJar",
};

export function createJars(jars: JarTileProps[]) {
  const jarGrid = queryElt(document, selectors.jarGrid);
  const addJar = queryElt(document, selectors.addJar);

  const jarElts = createJarElts(jars);

  jarGrid?.insertBefore(jarElts, addJar);
}

function createJarElts(jarAttrsList: Partial<JarTileProps>[]) {
  const fragment = document.createDocumentFragment();

  jarAttrsList.forEach((item) => {
    const newJar = createFillableJar({
      ...defaultJarTileProps,
      ...item,
    });

    fragment.appendChild(newJar);
  });
  return fragment;
}

export function createFillableJar(prefs: JarTileProps) {
  const jar = document.createElement(jarTileTag) as JarTile;

  requestAnimationFrame(() => {
    for (const [prefName, pref] of Object.entries(prefs)) {
      jar.setAttribute(prefName, pref);
    }
  });
  return jar;
}
