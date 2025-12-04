import { ExportApi, Topic } from "../../api";
import { OpResult } from "../../types";
import { exportValidator } from "../validators";

function formatExport(topics: Topic[]): ExportApi {
  return {
    metadata: {
      semVer: "1.0.0",
      schemaVersion: 1,
      isoExportedAt: new Date().toISOString(),
    },
    topics,
  };
}

/**
 * @return stringified ExportApi
 */
export function createExportJson(topics: Topic[]): OpResult<ExportApi> {
  const settings = formatExport(topics);
  const validationStatus = exportValidator(settings);
  if (!validationStatus.success) {
    console.warn("Export error", validationStatus);
    return validationStatus;
  }

  return { success: true, data: validationStatus.data };
}

// separated validating and stringifying for better typing of both functions
export function stringifyExportJson(exportJson: ExportApi): OpResult<string> {
  try {
    return { success: true, data: JSON.stringify(exportJson, null, 2) };
  } catch (e) {
    return {
      success: false,
      errors: [{ message: "Unable to stringify exportJson", path: e + "" }],
    };
  }
}

/**
 * Parses and validates export json
 */
export function parseExportJson(json: string): OpResult<ExportApi> {
  try {
    const parsed = JSON.parse(json);
    const validationStatus = exportValidator(parsed);

    if (!validationStatus.success) {
      return validationStatus;
    }

    return { success: true, data: parsed };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: `JSON parse error: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
      ],
    };
  }
}
