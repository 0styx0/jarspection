import { ExportApi } from "../../api";
import { OpResult } from "../../types";
import { parseExportJson, stringifyExportJson } from "./storageUtils";

/**
 * @author MDN https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#feature-detecting_localstorage
 */
function storageAvailable(): OpResult<string> {
  let storage;
  try {
    storage = window.localStorage;
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return { success: true, data: "" };
  } catch (e) {
    return {
      success: false,
      errors: [{ message: "Unable to access browser storage", path: e + "" }],
    };
  }
}

export const exportKey = "exportKey";
export const nopResult = 'noOpResult'

// making Promise to conform with future retrieval from api func
export async function saveExportData(exportData: ExportApi): Promise<OpResult<unknown>> {
  const storageRes = storageAvailable();
  if (!storageRes.success) {
    return storageRes;
  }
  const stringifiedExport = stringifyExportJson(exportData);
  if (!stringifiedExport.success) {
    return stringifiedExport;
  }

  localStorage.setItem(exportKey, stringifiedExport.data);
  return { success: true, data: null };
}

export async function loadExportData(): Promise<OpResult<ExportApi>> {
  const storageRes = storageAvailable();
  console.log(storageRes)
  if (!storageRes.success) {
    return storageRes;
  }
  const stringifiedImport = localStorage.getItem(exportKey) || "";

  if (!stringifiedImport) {
    return {
      success: false,
      errors: [{
        path: nopResult,
        message: 'Storage is empty'
      }]
    }
  }

  return parseExportJson(stringifiedImport);
}
