import { JarAttrs } from "./components/fillable-jar/jarAttrs";
import { queryElt } from "./components/utils";
import { createJars } from "./utils";

const selectors = {
  importJarsInput: "#importJarsInput",
};

void (function init() {
  const importInput = queryElt<HTMLInputElement>(
    document,
    selectors.importJarsInput,
  );

  if (!importInput) return;

  importInput.addEventListener("change", handleImportChange);

  // Check for initial files
  if (importInput.files && importInput.files.length) {
    startLoad(importInput);
  }
})();

function importJarsFromFile(file: File): void {
  const reader = new FileReader();

  reader.onload = (e: ProgressEvent<FileReader>) => {
    const fileStr = getFileContents(e) || "";

    const jarAttrsList = parseFile(fileStr);

    removeJars();

    createJars(jarAttrsList);
  };

  reader.onerror = (e) => {
    console.error("Importing: File reading error", e);
  };

  reader.readAsText(file);
}

function getFileContents(e: ProgressEvent<FileReader>) {
  const result = e.target?.result;

  if (typeof result !== "string") {
    console.error("Invalid file read result");
    return;
  }
  return result;
}

function parseFile(fileStr: string) {
  let data: JarAttrs[] = [];
  try {
    data = JSON.parse(fileStr) as JarAttrs[];
  } catch (error) {
    console.error("Importing: Error parsing JSON:", error);
  }

  return data;
}

function removeJars() {
  document.querySelectorAll("fillable-jar").forEach((j) => j.remove());
}

function startLoad(input: HTMLInputElement): void {
  const file = input.files?.[0];

  if (!file) {
    console.warn("Importing: No file found");
    return;
  }

  importJarsFromFile(file);
}

function handleImportChange(e: Event): void {
  const input = e.target as HTMLInputElement;
  startLoad(input);
}
