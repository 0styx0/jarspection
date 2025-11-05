import templateHtml from "./JarsPageControls.html?raw";
import { Container } from "../../../api";
import { defineCustomElt, queryElt } from "../../../components/utils";
import { defaultContainers } from "../../../defaultJars";

interface JarsPageControlsProps {
  exportContainers: () => Container[];
  importContainers: (containers: Container[]) => void;
}

const selectors = {
  exportElt: ".exportContainers",
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

class JarsPageControls extends HTMLElement {
  private props: JarsPageControlsProps = defaultProps;

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  setProps(props: JarsPageControlsProps) {
    this.props = props;
  }

  handleExport() {
    this.props.exportContainers();
  }

  handleImport() {
    this.props.importContainers([]);
  }
}

export const jarPageControlsTag = "jar-page-controls";
defineCustomElt(jarPageControlsTag, JarsPageControls);
