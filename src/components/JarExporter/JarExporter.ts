import templateHtml from "./JarExporter.html?raw";
import { Container } from "../../api";
import { defineCustomElt } from "../utils";

interface ExportContainersProps {
  exportContainers: () => Container[];
}

const selectors = {
  exportBtn: ".exportBtn",
};

const defaultProps: ExportContainersProps = {
  exportContainers: () => {
    console.error("JarsPageControls: Please set exportContainers prop");
    return [];
  },
};

class JarExporter extends HTMLElement {
  private props: ExportContainersProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  handleExport() {
    this.props.exportContainers();
  }
}

export const jarExporterTag = "jar-exporter";
defineCustomElt(jarExporterTag, JarExporter);
