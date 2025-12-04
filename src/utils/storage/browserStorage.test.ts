import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockImportContents } from "../../../test/importHelpers";
import {
  exportKey,
  loadExportData,
  nopResult,
  saveExportData,
} from "./browserStorage";
import { ExportApi } from "../../api";

const mockImportContents = createMockImportContents();

function mockStorageError() {
  vi.spyOn(Storage.prototype, "setItem").mockImplementationOnce(() => {
    throw new Error("QuotaExceededError");
  });
}

describe("loadExportData", () => {
  describe("Error Scenarios", () => {
    it("should return an error if storage is full", async () => {
      mockStorageError();

      const result = await loadExportData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toMatch(
          "Unable to access browser storage",
        );
      }
    });

    it("should return an error on validation failure", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
        JSON.stringify({
          ...mockImportContents,
          topics: {},
        } as ExportApi),
      );

      const result = await loadExportData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0]).toEqual({
          message: "Must be an array",
          path: "root.topics",
        });
      }
    });

    it("should return an error when parsing invalid JSON", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
        "not real json :o",
      );

      const result = await loadExportData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toMatch(/json|parse/i);
      }
    });
  });

  describe("Success Scenarios", () => {
    it("should return no-op if storage is empty", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

      const result = await loadExportData();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].path).toBe(nopResult);
      }
    });

    it("should successfully load data when formatted correctly", async () => {
      vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
        JSON.stringify({
          ...mockImportContents,
        } as ExportApi),
      );

      const result = await loadExportData();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockImportContents);
      }
    });
  });
});

describe("saveExportData", () => {
  describe("Error Scenarios", () => {
    it("should error if storage is full", async () => {
      mockStorageError();

      const result = await saveExportData(mockImportContents);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toMatch(/storage|quota|full/i);
      }
    });

    it("should error on validation failure", async () => {
      const invalidData = { invalid: "structure" } as unknown as ExportApi;

      const result = await saveExportData(invalidData);

      expect(result.success).toBe(false);
    });

    it("should error when stringifying fails", async () => {
      const circularData = {} as ExportApi;
      (circularData as any).self = circularData;

      const result = await saveExportData(circularData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Success Scenarios", () => {
    it("should successfully save data when formatted correctly", async () => {
      const result = await saveExportData(mockImportContents);

      expect(result.success).toBe(true);
      expect(localStorage.getItem(exportKey)).toEqual(
        JSON.stringify(mockImportContents),
      );
    });
  });
});
