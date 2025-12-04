/**

Creates and prompts user to download a json file consisting of all containers retrieved via props.exportContainers

*/

import templateHtml from "./JarExporter.html?raw";
import { ExportApi, Topic } from "../../api";
import { defineCustomElt, queryElt } from "../componentUtils";
import { ComplexComponent } from "../../interfaces/ComplexComponent";
import { exportValidator } from "../../utils/validators";
import {
  createExportJson,
  stringifyExportJson,
} from "../../utils/storage/storageUtils";
import { OpResult } from "../../types";

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
    const settings = this.props.exportContainers();

    const exportJson = createExportJson(settings);
    if (!exportJson.success) {
      console.warn("Export error", exportJson);
      return;
    }

    const exportFile = this.createFile(exportJson.data);
    if (!exportFile.success) {
      console.warn("Export error", exportFile);
      return;
    }

    this.triggerDownload(exportFile.data);
  };

  private createFile(containerSettings: ExportApi): OpResult<Blob> {
    const exportStr = stringifyExportJson(containerSettings);

    if (!exportStr.success) {
      return exportStr;
    }

    return {
      success: true,
      data: new Blob([exportStr.data], {
        type: "application/json",
      }),
    };
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
