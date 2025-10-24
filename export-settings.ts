import { FillableJar } from "./components/fillable-jar/fillable-jar";
import { JarPrefs } from "./types";

function exportJarsToJson() {
  const jarPrefs = getJarPrefsFromPage();
  downloadJars(jarPrefs);
}

function getJarPrefsFromPage(): JarPrefs[] {
  const jars = document.querySelectorAll(
    "fillable-jar",
  ) as NodeListOf<FillableJar>;
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

function downloadJars(jarPrefs: JarPrefs[]) {
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
