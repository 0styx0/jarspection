import templateHtml from "./JarsPageControls.html?raw";
import { Container } from "../../../api";
import { defineCustomElt, queryElt } from "../../../components/utils";
import { defaultContainers } from "../../../defaultJars";
import {
  JarImporter,
  JarImporterProps,
  jarImporterTag,
} from "../../../components/JarImporter/JarImporter";

interface JarsPageControlsProps {
  exportContainers: () => Container[];
  importContainers: (containers: Container[]) => void;
}

const selectors = {
  jarImporterPlaceholder: ".jar-importer-placeholder",
  jarExporterPlaceholder: ".jar-exporter-placeholder",
};

const defaultProps: JarsPageControlsProps = {
  exportContainers: () => {
    console.error("JarsPageControls: Please set exportContainers prop");
    return [];
  },
  importContainers: (containers) => {
    console.error("JarsPageControls: Please set importContainers prop");
  },
};

export class JarsPageControls extends HTMLElement {
  private props: JarsPageControlsProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.renderImportElt();
  }

  setProps(props: JarsPageControlsProps) {
    this.props = props;
  }

  renderImportElt() {
    const importElt = createJarImporterElt({
      importContainers: this.handleImport,
    });
    queryElt(this.shadowRoot, selectors.jarImporterPlaceholder)?.replaceWith(
      importElt,
    );
  }

  handleExport() {
    this.props.exportContainers();
  }

  // proxy for props in case props change
  handleImport = (containers: Container[]) => {
    this.props.importContainers(containers);
  };
}

function createJarImporterElt(jarImporterProps: JarImporterProps) {
  const jarImporter = document.createElement(jarImporterTag) as JarImporter;

  requestAnimationFrame(() => {
    jarImporter.setProps(jarImporterProps);
  });

  return jarImporter;
}

export const jarPageControlsTag = "jar-page-controls";
defineCustomElt(jarPageControlsTag, JarsPageControls);
