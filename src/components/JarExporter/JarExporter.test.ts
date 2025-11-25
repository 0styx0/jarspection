import { describe, it, expect, vi, vitest } from "vitest";
import { JarExporter, jarExporterTag, selectors } from "./JarExporter";
import { defineCustomElt } from "../componentUtils";
import { createDateMock, renderComponent } from "../../test/testUtils";
import { createMockImportContents } from "../../../test/importHelpers";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { ExportApi, Topic } from "../../api";
import { getDefaultTopics } from "../../defaultJars";

defineCustomElt(jarExporterTag, JarExporter);

const renderJarExporter = () => {
  const component = renderComponent<JarExporter>(jarExporterTag);
  const exportTopicsSpy = vi.fn<[], Topic[]>();
  component.setProps({ exportContainers: exportTopicsSpy });

  const user = userEvent.setup();

  return { component, exportContainersSpy: exportTopicsSpy, user };
};

const getExportButton = (component: JarExporter): HTMLButtonElement => {
  const button = component.shadowRoot?.querySelector<HTMLButtonElement>(
    selectors.exportBtn,
  );
  expect(button).toBeTruthy();
  return button!;
};

const createMockTopics = (): Topic[] => createMockImportContents().topics;

describe("<jar-exporter>", () => {
  it("renders download button", () => {
    const { component } = renderJarExporter();
    const button = getExportButton(component);
    expect(button).toBeInstanceOf(HTMLButtonElement);
  });

  describe("onClick", () => {
    it("exports containers with correct structure", async () => {
      const mockDate = createDateMock();
      const { component, exportContainersSpy, user } = renderJarExporter();
      const topics = createMockTopics();
      exportContainersSpy.mockReturnValue(topics);

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
      const parsedData: ExportApi = JSON.parse(blobText);

      expect(parsedData).toEqual({
        metadata: {
          semVer: "1.0.0",
          schemaVersion: 1,
          isoExportedAt: mockDate.toISOString(),
        },
        topics: topics,
      });
    });

    it("exports default settings", async () => {
      const { component, exportContainersSpy, user } = renderJarExporter();
      exportContainersSpy.mockReturnValue(getDefaultTopics());


      const createObjectURLSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockImplementation(vi.fn());

      const button = getExportButton(component);
      await user.click(button);

      const actualExportContents = createObjectURLSpy.mock.lastCall?.[0];
      await waitFor(() => {
        expect(actualExportContents).toBeInstanceOf(Blob);
      });
    });

    it("errors if export breaks validation rules", async () => {
      const { component, exportContainersSpy, user } = renderJarExporter();
      const topics = getDefaultTopics()
      topics[0].metadata.tags = [
        {
          name:
            // over the max length
            "----------------------------------------------------------------",
        },
      ];
      exportContainersSpy.mockReturnValue(topics);

      const createObjectURLSpy = vi
        .spyOn(URL, "createObjectURL")
        .mockImplementation(vi.fn());

      const button = getExportButton(component);
      await user.click(button);

      await waitFor(() => {
        expect(createObjectURLSpy).not.toHaveBeenCalled();
      });
    });
  });
});
