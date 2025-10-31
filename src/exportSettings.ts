import { JarTile, jarTileTag } from "./components/JarTile/JarTile";
import { JarAttrs } from "./components/jar/jarAttrs";

function exportJarsToJson() {
  const jarPrefs = getJarPrefsFromPage();
  downloadJars(jarPrefs);
}

function getJarPrefsFromPage(): JarAttrs[] {
  const jars = document.querySelectorAll(jarTileTag) as NodeListOf<JarTile>;
  return Array.from(jars).map((jar) => {
    return {
      label: jar.label,
      fill: jar.fill,
      color: jar.color,
      giving: jar.giving,
      receiving: jar.receiving,
    };
  });
}

function downloadJars(jarPrefs: JarAttrs[]) {
  const blob = new Blob([JSON.stringify(jarPrefs, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "jars-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

document
  .getElementById("exportJarsInput")
  ?.addEventListener("click", exportJarsToJson);
