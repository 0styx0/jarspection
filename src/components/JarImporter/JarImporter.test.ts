import { describe, it, expect, vi } from "vitest";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { JarImporter, jarImporterTag } from "./JarImporter";
import { defaultContainers } from "../../defaultJars";
import { defineCustomElt } from "../componentUtils";
import { renderComponent } from "../../test/testUtils";
import {
  createMockFile,
  createMockImportContents,
  getImportInput,
} from "../../../test/importHelpers";

defineCustomElt(jarImporterTag, JarImporter);

const renderJarImporter = () => {
  const component = renderComponent<JarImporter>(jarImporterTag);

  const importContainersSpy = vi.fn();
  component.setProps({ importContainers: importContainersSpy });

  const user = userEvent.setup();

  return { component, importContainersSpy, user };
};

describe("<jar-importer>", () => {
  describe("initial rendering", () => {
    it("calls importContainers with default containers when no file is present", () => {
      const { component, importContainersSpy } = renderJarImporter();

      expect(importContainersSpy).toHaveBeenCalledWith(defaultContainers);
      expect(importContainersSpy).toHaveBeenCalledTimes(1);
    });

    it("calls importContainers with file contents when valid file is present on load", async () => {
      const { component, importContainersSpy, user } = renderJarImporter();

      const mockImportContents = createMockImportContents();
      const mockFile = createMockFile(JSON.stringify(mockImportContents));

      const input = getImportInput(component);
      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toHaveBeenCalled();
      });
    });

    it("calls importContainers with empty array when invalid file is present on load", async () => {
      const { component, importContainersSpy, user } = renderJarImporter();
      const input = getImportInput(component);

      const mockFile = createMockFile("invalid json content");
      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toHaveBeenCalledWith([]);
      });
    });
  });

  describe("file upload", () => {
    it("calls importContainers with file contents when valid file is uploaded", async () => {
      const user = userEvent.setup();
      const { component, importContainersSpy } = renderJarImporter();
      const input = getImportInput(component);

      const mockImportContents = createMockImportContents();
      const mockFile = createMockFile(JSON.stringify(mockImportContents));

      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toBeCalledWith(
          mockImportContents.topic,
        );
      });
    });

    it("does not call importContainers when no file is selected after initial load", async () => {
      const { component, importContainersSpy } = renderJarImporter();
      const input = getImportInput(component);

      const initialCallCount = importContainersSpy.mock.calls.length;

      input.dispatchEvent(new Event("change", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(importContainersSpy).toHaveBeenCalledTimes(initialCallCount);
    });
  });
});
