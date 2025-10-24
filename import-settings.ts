import { FillableJar } from "./components/fillable-jar/fillable-jar";
import { JarPrefs } from "./types";
import { createFillableJar } from "./utils";

function importJarsFromJson(file: File): void {
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    // Safely handle potential null or undefined result
    const result = e.target?.result;

    if (typeof result !== "string") {
      console.error("Invalid file read result");
      return;
    }

    try {
      const data = JSON.parse(result) as JarPrefs[];
      const jarGrid = document.getElementById("jarGrid");
      const addJar = document.getElementById("addJar");

      if (!jarGrid || !addJar) {
        console.error("Required DOM elements not found", { jarGrid, addJar });
        return;
      }

      // Remove existing jars if desired
      jarGrid.querySelectorAll("fillable-jar").forEach((j) => j.remove());

      data.forEach((item: JarPrefs) => {

        const jar = createFillableJar(
          item
        )

        jarGrid.insertBefore(jar, addJar);
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  };

  reader.onerror = (e) => {
    console.error("File reading error", e);
  };

  reader.readAsText(file);
}

function startLoad(input: HTMLInputElement): void {
  const file = input.files?.[0];
  if (file) {
    importJarsFromJson(file);
  }
}

// Type-safe event handling
function handleImportChange(e: Event): void {
  const input = e.target as HTMLInputElement;
  if (input.files && input.files.length) {
    startLoad(input);
  }
}

// Type assertions and null checks
const importInput = document.getElementById(
  "importJarsInput",
) as HTMLInputElement;
const importLoading = document.getElementById("import-loading");

if (importInput) {
  importInput.addEventListener("change", handleImportChange);

  // Check for initial files
  if (importInput.files && importInput.files.length) {
    startLoad(importInput);
  }
}
