import { expect } from "vitest";
import { ApiContainerSettings } from "../src/api";
import { JarImporter } from "../src/components/JarImporter/JarImporter";

export const createMockFile = (content: string, filename = "test.json"): File =>
  new File([content], filename, { type: "application/json" });

export const createMockImportContents = (): ApiContainerSettings => ({
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

export const getImportInput = (component: HTMLElement): HTMLInputElement => {
  const input =
    component.shadowRoot?.querySelector<HTMLInputElement>('input[type="file"]');
  expect(input).toBeTruthy();
  return input!;
};
