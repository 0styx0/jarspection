import { describe, it, expect, vi } from "vitest";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { JarImporter, JarImporterProps, jarImporterTag } from "./JarImporter";
import { Container, ContainerSettings } from "../../api";
import { defaultContainers } from "../../defaultJars";
import { defineCustomElt } from "../utils";
import { renderComponent } from "../../test/testUtils";

defineCustomElt(jarImporterTag, JarImporter);

const createMockFile = (content: string, filename = "test.json"): File =>
  new File([content], filename, { type: "application/json" });

const createMockImportContents = (): ContainerSettings => ({
  version: "1.0.9",
  containers: [
    {
      containerLabel: "Test Container",
      categories: [
        {
          categoryLabel: "Yes",
          hexColor: "#44ff44",
          percent: 50,
        },
      ],
    },
  ],
});

const getFileInput = (component: JarImporter): HTMLInputElement => {
  const input =
    component.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
  expect(input).toBeTruthy();
  return input!;
};

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

      const input = getFileInput(component);
      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toHaveBeenCalled();
      });
    });

    it("calls importContainers with empty array when invalid file is present on load", async () => {
      const { component, importContainersSpy, user } = renderJarImporter();
      const input = getFileInput(component);

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
      const input = getFileInput(component);

      const mockImportContents = createMockImportContents();
      const mockFile = createMockFile(JSON.stringify(mockImportContents));

      await user.upload(input, mockFile);

      await waitFor(() => {
        expect(importContainersSpy).toBeCalledWith(
          mockImportContents.containers,
        );
      });
    });

    it("does not call importContainers when no file is selected after initial load", async () => {
      const { component, importContainersSpy } = renderJarImporter();
      const input = getFileInput(component);

      const initialCallCount = importContainersSpy.mock.calls.length;

      input.dispatchEvent(new Event("change", { bubbles: true }));

      await new Promise((resolve) => setTimeout(resolve, 50));

      expect(importContainersSpy).toHaveBeenCalledTimes(initialCallCount);
    });
  });
});
