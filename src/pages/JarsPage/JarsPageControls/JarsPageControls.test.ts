/**
Depends on knowing the HTML of importer and exporter to test callback triggers
*/

import { describe, it, expect, vi } from "vitest";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { JarsPageControls, jarPageControlsTag } from "./JarsPageControls";
import { jarImporterTag } from "../../../components/JarImporter/JarImporter";
import {
  jarExporterTag,
  selectors as exportSelectors,
} from "../../../components/JarExporter/JarExporter";
import { Container, ExportApi } from "../../../api";
import { defineCustomElt } from "../../../components/componentUtils";
import { renderComponent } from "../../../test/testUtils";
import {
  createMockFile,
  createMockImportContents,
} from "../../../../test/importHelpers";

defineCustomElt(jarPageControlsTag, JarsPageControls);

const renderJarsPageControls = () => {
  const component = renderComponent<JarsPageControls>(jarPageControlsTag);
  const exportContainersSpy = vi.fn<[], Container[]>().mockReturnValue([]);
  const importContainersSpy = vi.fn<[Container[]], void>();

  component.setProps({
    exportContainers: exportContainersSpy,
    importContainers: importContainersSpy,
  });

  const user = userEvent.setup();

  return { component, exportContainersSpy, importContainersSpy, user };
};

const getJarImporter = (component: JarsPageControls) => {
  const jarImporter = component.shadowRoot?.querySelector(jarImporterTag);
  expect(jarImporter).toBeTruthy();
  return jarImporter!;
};

const getJarExporter = (component: JarsPageControls) => {
  const jarExporter = component.shadowRoot?.querySelector(jarExporterTag);
  expect(jarExporter).toBeTruthy();
  return jarExporter!;
};

const getFileInputFromImporter = (jarImporter: Element): HTMLInputElement => {
  const input =
    jarImporter.shadowRoot?.querySelector<HTMLInputElement>(
      'input[type="file"]',
    );
  expect(input).toBeTruthy();
  return input!;
};

describe("<jar-page-controls>", () => {
  describe("import", () => {
    it("loads <jar-importer> on render", async () => {
      const { component } = renderJarsPageControls();

      // Wait for requestAnimationFrame to complete
      await waitFor(() => {
        const jarImporter = component.shadowRoot?.querySelector(jarImporterTag);
        expect(jarImporter).toBeTruthy();
      });
    });

    it("calls props.importContainers when <jar-importer> calls _its_ props.importContainers", async () => {
      const { component, importContainersSpy, user } = renderJarsPageControls();

      await waitFor(() => {
        const jarImporter = component.shadowRoot?.querySelector(jarImporterTag);
        expect(jarImporter).toBeTruthy();
      });

      const jarImporter = getJarImporter(component);
      const input = getFileInputFromImporter(jarImporter);

      const mockImportContents = createMockImportContents();
      const mockFile = createMockFile(JSON.stringify(mockImportContents));

      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toHaveBeenCalledWith(
          mockImportContents.topic,
        );
      });
    });
  });

  describe("export", () => {
    it("loads <jar-exporter> on render", () => {
      const { component } = renderJarsPageControls();

      const jarExporter = component.shadowRoot?.querySelector(jarExporterTag);
      expect(jarExporter).toBeTruthy();
    });

    it("calls props.exportContainers when <jar-exporter> calls _its_ props.exportContainers", async () => {
      const { component, exportContainersSpy, user } = renderJarsPageControls();

      await waitFor(() => {
        const jarExporter = component.shadowRoot?.querySelector(jarExporterTag);
        expect(jarExporter).toBeTruthy();
      });

      const jarExporter = getJarExporter(component);

      const exportButton =
        jarExporter.shadowRoot?.querySelector<HTMLButtonElement>(
          exportSelectors.exportBtn,
        );

      expect(exportButton).toBeTruthy();
      await user.click(exportButton!);

      await waitFor(() => {
        expect(exportContainersSpy).toHaveBeenCalled();
      });
    });
  });
});
