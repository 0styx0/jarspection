import { FillableJar } from "./components/fillable-jar/fillable-jar.js";
import { defaultKinks } from "./kinks.js";
import { JarPrefs } from "./types.js";

export function createDefaultJars() {
  const jarGrid = document.getElementById("jarGrid");
  const addJar = document.querySelector("add-jar");

  const fragment = document.createDocumentFragment();

  defaultKinks.forEach((item: JarPrefs) => {
    const newJar = createFillableJar({
      label: item.label,
    });

    fragment.appendChild(newJar);
  });

  jarGrid.insertBefore(fragment, addJar);
}

export function createFillableJar(prefs: JarPrefs) {
  const jar = document.createElement("fillable-jar") as FillableJar;

  requestAnimationFrame(() => {
    // jar.fill = prefs.fill || jar.fill;
    // jar.color = prefs.color || jar.color;
    jar.setAttribute("label", prefs.label || jar.label);
    // jar.giving = prefs.giving || jar.giving;
    // jar.receiving = prefs.receiving || jar.receiving;
  });
  return jar;
}
