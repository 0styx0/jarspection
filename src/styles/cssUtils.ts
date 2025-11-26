import cssUtils from "./utils.css?inline";

export const cssUtilsSheet = new CSSStyleSheet();
cssUtilsSheet.replaceSync(cssUtils);
