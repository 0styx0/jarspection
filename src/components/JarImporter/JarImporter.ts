/**

### Overview
On component load:
- Loads a file that the user previously uploaded
- Loads default view if the user has not provided an import file

When a user uploads a file:
- Load that file into the view

If the user provides an invalid file, we fallback to a blank screen
  Later we will add error messages, for now we log errors


*/
import templateHtml from "./JarImporter.html?raw";
import {
  CategoryItem,
  colors,
  Container,
  ContainerSettings,
  HexColorValue,
} from "../../api";
import { defaultContainers } from "../../defaultJars";
import { defineCustomElt, queryElt } from "../componentUtils";
import { ComplexComponent } from "../../interfaces/ComplexComponent";

export interface JarImporterProps {
  importContainers: (containers: Container[]) => void;
}

export const selectors = {
  importBtn: ".importBtn",
};

const defaultProps: JarImporterProps = {
  importContainers: () => {
    console.error("JarImporter: Please set importContainers prop");
  },
};

const fallbackImportContents = {
  version: "0",
  containers: [],
};

export class JarImporter
  extends HTMLElement
  implements ComplexComponent<JarImporterProps>
{
  private props: JarImporterProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  setProps(props: JarImporterProps) {
    this.props = props;
    this.initializeContainers();
  }

  connectedCallback() {
    this.addImportClickHandler();
  }

  private initializeContainers() {
    const importFile = this.getImportFile();
    if (importFile) {
      this.importFromFile(importFile);
      return;
    }

    this.props.importContainers(defaultContainers);
  }

  private addImportClickHandler() {
    this.getFileInputElt()?.addEventListener("change", () => {
      const importFile = this.getImportFile();

      if (!importFile) {
        console.info("JarImporter: Unable to import settings - No import file");
        return;
      }

      this.importFromFile(importFile);
    });
  }

  private getFileInputElt() {
    return queryElt<HTMLInputElement>(this.shadowRoot, selectors.importBtn);
  }

  private async importFromFile(file: File) {
    const containers = await this.parseImportFile(file);

    this.props.importContainers(containers);
  }

  private getImportFile(): File | null {
    const importInput = this.getFileInputElt();

    return importInput?.files?.item(0) ?? null;
  }

  private async parseImportFile(file: File): Promise<Container[]> {
    const contents = await this.readFileContents(file);
    const json = this.parseContainerJson(contents);
    const isValidImportFile = this.validateImportFile(json);

    if (!isValidImportFile) {
      return fallbackImportContents.containers;
    }

    return json.containers;
  }

  private parseContainerJson(containerText: string): ContainerSettings {
    try {
      return JSON.parse(containerText);
    } catch (e) {
      console.error("Import error parsing json", containerText);
      return fallbackImportContents;
    }
  }

  private readFileContents(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === "string") {
          resolve(result);
        } else {
          reject(new Error("Failed to read file as text"));
        }
      };
      reader.onerror = () => {
        console.warn("Unable to read import file");
        reject("");
      };
      reader.readAsText(file);
    });
  }

  private validateImportFile(containerSettings: ContainerSettings): boolean {
    // Check top-level structure
    if (
      !containerSettings ||
      typeof containerSettings !== "object" ||
      typeof containerSettings.version !== "string" ||
      !Array.isArray(containerSettings.containers)
    ) {
      console.error("Invalid import file structure");
      return false;
    }

    // Validate each container
    for (const container of containerSettings.containers) {
      if (!this.isValidContainer(container)) {
        console.error("Invalid container found:", container);
        return false;
      }
    }

    return true;
  }

  private isValidContainer(container: unknown): container is Container {
    if (!container || typeof container !== "object") {
      return false;
    }

    const c = container as Record<string, unknown>;

    // Check containerLabel
    if (
      typeof c.containerLabel !== "string" ||
      c.containerLabel.trim() === ""
    ) {
      return false;
    }

    // Check categories array
    if (!Array.isArray(c.categories)) {
      return false;
    }

    // Validate each category
    for (const category of c.categories) {
      if (!this.isValidCategory(category)) {
        return false;
      }
    }

    return true;
  }

  private isValidCategory(category: unknown): category is CategoryItem {
    if (!category || typeof category !== "object") {
      return false;
    }

    const cat = category as Record<string, unknown>;

    // Check categoryLabel
    if (
      typeof cat.categoryLabel !== "string" ||
      cat.categoryLabel.trim() === ""
    ) {
      return false;
    }

    // Check hexColor
    if (!this.isValidHexColor(cat.hexColor)) {
      return false;
    }

    // Check percent
    if (
      typeof cat.percent !== "number" ||
      cat.percent < 0 ||
      cat.percent > 100 ||
      !Number.isFinite(cat.percent)
    ) {
      return false;
    }

    return true;
  }

  private isValidHexColor(color: unknown): color is HexColorValue {
    if (typeof color !== "string") {
      return false;
    }

    // Check if it's a valid hex color format
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/;
    if (!hexColorRegex.test(color)) {
      return false;
    }

    // Check if it's one of the allowed colors
    const validColors = Object.values(colors) as string[];
    return validColors.includes(color);
  }
}

export const jarImporterTag = "jar-importer";
defineCustomElt(jarImporterTag, JarImporter);
