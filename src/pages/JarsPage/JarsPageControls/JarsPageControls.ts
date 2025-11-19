import templateHtml from "./JarsPageControls.html?raw";
import { Container } from "../../../api";
import {
  createComplexComponent,
  defineCustomElt,
  queryElt,
} from "../../../components/utils";
import {
  JarImporter,
  JarImporterProps,
  jarImporterTag,
} from "../../../components/JarImporter/JarImporter";
import {
  JarExporter,
  JarExporterProps,
  jarExporterTag,
} from "../../../components/JarExporter/JarExporter";

export interface JarsPageControlsProps {
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
    this.renderExportElt();
  }

  setProps(props: JarsPageControlsProps) {
    this.props = props;
  }

  private renderImportElt() {
    const importElt = createComplexComponent<JarImporter, JarImporterProps>(
      jarImporterTag,
      {
        importContainers: this.handleImport,
      },
    );
    queryElt(this.shadowRoot, selectors.jarImporterPlaceholder)?.replaceWith(
      importElt,
    );
  }

  private renderExportElt() {
    const importElt = createComplexComponent<JarExporter, JarExporterProps>(
      jarExporterTag,
      {
        exportContainers: this.handleExport,
      },
    );
    queryElt(this.shadowRoot, selectors.jarExporterPlaceholder)?.replaceWith(
      importElt,
    );
  }

  private handleExport = () => {
    return this.props.exportContainers();
  };

  // proxy for props in case props change
  private handleImport = (containers: Container[]) => {
    this.props.importContainers(containers);
  };
}

export const jarPageControlsTag = "jar-page-controls";
defineCustomElt(jarPageControlsTag, JarsPageControls);
