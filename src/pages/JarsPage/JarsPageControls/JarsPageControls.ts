import templateHtml from "./JarsPageControls.html?raw";
import {
  createComplexComponent,
  defineCustomElt,
  queryElt,
} from "../../../components/componentUtils";
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
import { Topic } from "../../../api";

export interface JarsPageControlsProps {
  exportContainers: () => Topic[];
  importContainers: (containers: Topic[]) => void;
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
  importContainers: (topics) => {
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
  private handleImport = (containers: Topic[]) => {
    this.props.importContainers(containers);
  };
}

export const jarPageControlsTag = "jar-page-controls";
defineCustomElt(jarPageControlsTag, JarsPageControls);
