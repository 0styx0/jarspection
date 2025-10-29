import { JarTile, jarTileTag } from "./components/jarTile/jarTile.js";
import {
  defaultJarAttrs,
  JarAttrs,
} from "./components/jarIllustration/jarAttrs";
import { queryElt } from "./components/utils.js";

const selectors = {
  jarGrid: "#jarGrid",
  addJar: "#addJar",
};

export function createJars(jars: JarAttrs[]) {
  const jarGrid = queryElt(document, selectors.jarGrid);
  const addJar = queryElt(document, selectors.addJar);

  const jarElts = createJarElts(jars);

  jarGrid?.insertBefore(jarElts, addJar);
}

function createJarElts(jarAttrsList: Partial<JarAttrs>[]) {
  const fragment = document.createDocumentFragment();

  jarAttrsList.forEach((item) => {
    const newJar = createFillableJar({
      ...defaultJarAttrs,
      ...item,
    });

    fragment.appendChild(newJar);
  });
  return fragment;
}

export function createFillableJar(prefs: JarAttrs) {
  const jar = document.createElement(jarTileTag) as JarTile;

  requestAnimationFrame(() => {
    for (const [prefName, pref] of Object.entries(prefs)) {
      jar.setAttribute(prefName, pref);
    }
  });
  return jar;
}
