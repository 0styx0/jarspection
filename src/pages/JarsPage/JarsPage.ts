/**

Acts as the controller for the page:
- Loads imported data into the grid
- Sets data from the grid when export functionality is called
*/

import templateHtml from "./JarsPage.html?raw";
import {
  createComplexComponent,
  defineCustomElt,
  queryElt,
  queryElts,
} from "../../components/componentUtils";
import { Container } from "../../api";
import {
  jarPageControlsTag,
  JarsPageControls,
  JarsPageControlsProps,
} from "./JarsPageControls/JarsPageControls";
import {
  JarGrid,
  JarGridProps,
  jarGridTag,
} from "../../components/JarGrid/JarGrid";

export const selectors = {
  jarPageControlsPlaceholder: ".jar-page-controls-placeholder",
  jarGridPlaceholder: ".jar-grid-placeholder",
  jarGrid: jarGridTag,
  jarPageControls: jarPageControlsTag,
};

// process:
// pageControls:
//   - import
//   - export
//
// on page load:
// on importClick:
//   - <import-control> reads file into Container's
//   - <import-control> calls importControls.props.importContainers(containers)
// on exportClick:
//   - <export-control>: exportControls.props.exportContainers()
//   - exportControls creates and prompts user to download file
//
// structure:
//  <jarPage>
//    <pageControls>
//      <exportControls>
//      <importControls>
//    </pageControls>
//    <jarGrid>
//   </jarPage>
//

/*

programmatically create JarPageControls
onExport: return tile attrs
onImport: replace tiles with importer info
  warn user about data loss

*/

export class JarsPage extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }

  connectedCallback() {
    this.renderJarGrid();
    this.renderPageControls();
  }

  private export = (): Container[] => {
    const jarGrid = queryElt<JarGrid>(this.shadowRoot, selectors.jarGrid)!;
    return [...jarGrid.exportTopics().values()];
  };

  private import = (containers: Container[]) => {
    const jarGrid = queryElt<JarGrid>(this.shadowRoot, selectors.jarGrid);
    if (!jarGrid) {
      console.warn("JarsPage: Import failed. Grid not found!");
      return;
    }

    jarGrid.setProps({ jars: containers });
  };

  private renderPageControls() {
    const pageControls = createComplexComponent<
      JarsPageControls,
      JarsPageControlsProps
    >(jarPageControlsTag, {
      exportContainers: this.export,
      importContainers: this.import,
    });

    queryElt(
      this.shadowRoot,
      selectors.jarPageControlsPlaceholder,
    )?.replaceWith(pageControls);
  }

  private renderJarGrid() {
    const jarGrid = createComplexComponent<JarGrid, JarGridProps>(jarGridTag, {
      jars: [],
    });

    queryElt(this.shadowRoot, selectors.jarGridPlaceholder)?.replaceWith(
      jarGrid,
    );
  }
}

export const jarsPageTag = "jars-page";
defineCustomElt(jarsPageTag, JarsPage);
