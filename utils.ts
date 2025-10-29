import { FillableJar } from "./components/fillable-jar/fillable-jar.js";
import {
  defaultJarAttrs,
  JarAttrs,
} from "./components/fillable-jar/jarAttrs.js";
import { queryElt } from "./components/utils.js";

export const documentLevelSelectors = {
  jarGrid: "#jarGrid",
  addJar: "add-jar",
};

export function createJars(jars: JarAttrs[]) {
  const jarGrid = queryElt(document, documentLevelSelectors.jarGrid);
  const addJar = queryElt(document, documentLevelSelectors.addJar);

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
  const jar = document.createElement("fillable-jar") as FillableJar;

  requestAnimationFrame(() => {
    for (const [prefName, pref] of Object.entries(prefs)) {
      jar.setAttribute(prefName, pref);
    }
  });
  return jar;
}
