import { FillableJar } from "./components/fillable-jar/fillable-jar.js";
import { defaultKinks } from "./kinks.js";
import {
  defaultJarAttrs,
  JarAttrs,
} from "./components/fillable-jar/jarAttrs.js";

export function createDefaultJars() {
  const jarGrid = queryElt(document, "#jarGrid");
  const addJar = queryElt(document, "add-jar");

  const fragment = document.createDocumentFragment();

  defaultKinks.forEach((item: JarAttrs) => {
    const newJar = createFillableJar({
      ...defaultJarAttrs,
      label: item.label,
    });

    fragment.appendChild(newJar);
  });

  jarGrid.insertBefore(fragment, addJar);
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
    return;
  }

  const elt = container.querySelector<Elt>(selector);

  if (!elt) {
    console.warn("Unable to find element ", selector);
    return;
  }

  return elt;
}
