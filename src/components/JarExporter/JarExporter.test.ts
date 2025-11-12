import { describe, it, expect, vi } from "vitest";
import { JarExporter, jarExporterTag, selectors } from "./JarExporter";
import { Container } from "../../api";
import { defineCustomElt } from "../utils";
import { renderComponent } from "../../test/testUtils";
import { createMockImportContents } from "../../../test/importHelpers";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

defineCustomElt(jarExporterTag, JarExporter);

const renderJarExporter = () => {
  const component = renderComponent<JarExporter>(jarExporterTag);
  const exportContainersSpy = vi.fn<[], Container[]>();
  component.setProps({ exportContainers: exportContainersSpy });

  const user = userEvent.setup();

  return { component, exportContainersSpy, user };
};

const getExportButton = (component: JarExporter): HTMLButtonElement => {
  const button = component.shadowRoot?.querySelector<HTMLButtonElement>(
    selectors.exportBtn,
  );
  expect(button).toBeTruthy();
  return button!;
};

const createMockContainers = (): Container[] =>
  createMockImportContents().containers;

describe("<jar-exporter>", () => {
  it("renders download button", () => {
    const { component } = renderJarExporter();
    const button = getExportButton(component);
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  describe("onClick", () => {
    it("exports containers with correct structure", async () => {
      const { component, exportContainersSpy, user } = renderJarExporter();
      const mockContainers = createMockContainers();
      exportContainersSpy.mockReturnValue(mockContainers);

      const createObjectURLSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockImplementation(vi.fn());

      const button = getExportButton(component);
      await user.click(button);

      const actualExportContents = createObjectURLSpy.mock.lastCall?.[0];
      await waitFor(() => {
        expect(actualExportContents).toBeInstanceOf(Blob);
      });

      const blobText = await (actualExportContents as Blob).text();
      const parsedData = JSON.parse(blobText);

      expect(parsedData).toEqual({
        version: "1.0.0",
        containers: mockContainers,
      });
    });
  });
});
