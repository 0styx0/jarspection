import { FillableJar } from "./components/fillable-jar/fillable-jar.js";
import {
  defaultJarAttrs,
  JarAttrs,
} from "./components/fillable-jar/jarAttrs.js";
import { defaultJars } from "./defaultJars.js";

const selectors = {
  jarGrid: "#jarGrid",
  addJar: "add-jar",
};

export function createDefaultJars() {
  const jarGrid = queryElt(document, selectors.jarGrid);
  const addJar = queryElt(document, selectors.addJar);

  const jarElts = createJarElts(defaultJars);

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

export function queryElt<Elt extends Element>(
  container: ShadowRoot | Document | null,
  selector: string,
) {
  if (!container) {
    console.warn("Unable to find container ", { container, selector });
    return null;
  }

  const elt = container.querySelector<Elt>(selector);

  if (!elt) {
    console.warn("Unable to find element ", selector);
    return null;
  }

  return elt;
}
