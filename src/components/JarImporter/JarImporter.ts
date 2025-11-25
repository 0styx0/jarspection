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
import { Emotion, ExportApi, Topic } from "../../api";
import { defaultTopics } from "../../defaultJars";
import { defineCustomElt, queryElt } from "../componentUtils";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { exportValidator, parseJson } from "../../utils/validators";

export interface JarImporterProps {
  importContainers: (topics: Topic[]) => void;
}

export const selectors = {
  importBtn: ".importBtn",
};

const defaultProps: JarImporterProps = {
  importContainers: () => {
    console.error("JarImporter: Please set importContainers prop");
  },
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

    this.props.importContainers(defaultTopics);
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

  private async parseImportFile(file: File): Promise<Topic[]> {
    const contents = await this.readFileContents(file);
    const json = parseJson(contents);

    if (!json.success) {
      console.warn("Importer: Invalid json", json);
      return [];
    }

    const validatedImport = exportValidator(json.data);
    if (!validatedImport.success) {
      console.warn("Importer: Invalid file", validatedImport);
      return [];
    }

    return validatedImport.data.topics;
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
}

export const jarImporterTag = "jar-importer";
defineCustomElt(jarImporterTag, JarImporter);
