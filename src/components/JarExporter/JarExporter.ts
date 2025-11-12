/**

Creates and prompts user to download a json file consisting of all containers retrieved via props.exportContainers

*/

import templateHtml from "./JarExporter.html?raw";
import { Container, ContainerSettings } from "../../api";
import { defineCustomElt, queryElt } from "../utils";

interface ExportContainersProps {
  exportContainers: () => Container[];
}

export const selectors = {
  exportBtn: ".exportJarsInput",
};

const defaultProps: ExportContainersProps = {
  exportContainers: () => {
    console.error("JarExporter: Please set exportContainers prop");
    return [];
  },
};

export class JarExporter extends HTMLElement {
  private props: ExportContainersProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.addExportHandler();
  }

  setProps(props: ExportContainersProps) {
    this.props = props;
  }

  private addExportHandler() {
    this.getExportBtnElt()?.addEventListener("click", () => {
      this.exportSettings();
    });
  }

  private exportSettings = () => {
    const settings = this.getExportData();
    const exportFile = this.createFile(settings);
    this.triggerDownload(exportFile);
  };

  private getExportData(): ContainerSettings {
    const containers = this.props.exportContainers();
    return {
      version: "1.0.0",
      containers,
    };
  }

  private createFile(containerSettings: ContainerSettings): Blob {
    return new Blob([JSON.stringify(containerSettings, null, 2)], {
      type: "application/json",
    });
  }

  private async triggerDownload(downloadFile: Blob) {
    const url = URL.createObjectURL(downloadFile);
    const a = document.createElement("a");
    a.href = url;
    a.download = "jars-export.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  private getExportBtnElt(): HTMLButtonElement | null {
    return queryElt<HTMLButtonElement>(this.shadowRoot, selectors.exportBtn);
  }
}

export const jarExporterTag = "jar-exporter";
defineCustomElt(jarExporterTag, JarExporter);
