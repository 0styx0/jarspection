import { expect } from "vitest";
import { ExportApi } from "../src/api";

export const createMockFile = (content: string, filename = "test.json"): File =>
  new File([content], filename, { type: "application/json" });

export const createMockImportContents = (): ExportApi => ({
  metadata: {
    semVer: "1.0.9",
    schemaVersion: 1,
    isoExportedAt: new Date().toISOString(),
  },
  topics: [
    {
      metadata: {
        id: "test-export",
        tags: [{ name: "default-tag" }],
      },
      name: "Test Container",
      emotions: [
        {
          metadata: {
            authorName: "Test user",
            isoCreatedAt: new Date().toISOString(),
            isoUpdatedAt: new Date().toISOString(),
          },
          producer: "Yes",
          reaction: "positive",
          strength: 50,
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
