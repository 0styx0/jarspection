/**

Creates and prompts user to download a json file consisting of all containers retrieved via props.exportContainers

*/

import templateHtml from "./JarExporter.html?raw";
import { ExportApi, Topic } from "../../api";
import { defineCustomElt, queryElt } from "../componentUtils";
import { ComplexComponent } from "../../interfaces/ComplexComponent";

export interface JarExporterProps {
  exportContainers: () => Topic[];
}

export const selectors = {
  exportBtn: ".exportJarsInput",
};

const defaultProps: JarExporterProps = {
  exportContainers: () => {
    console.error("JarExporter: Please set exportContainers prop");
    return [];
  },
};

export class JarExporter
  extends HTMLElement
  implements ComplexComponent<JarExporterProps>
{
  private props: JarExporterProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.addExportHandler();
  }

  setProps(props: JarExporterProps) {
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

  private getExportData(): ExportApi {
    const topics = this.props.exportContainers();
    return {
      metadata: {
        semVer: "1.0.0",
        schemaVersion: 1,
        isoExportedAt: new Date().toISOString(),
      },
      topics,
    };
  }

  private createFile(containerSettings: ExportApi): Blob {
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
