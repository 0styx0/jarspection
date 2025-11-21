import { colors, Container, ExportApi } from "./api";

export const xxx: ExportApi = {
  version: "1.0.0",
  topic: [],
};

export const defaultContainers: Container[] = [
  { label: "Words of Affirmation" },
  { label: "Acts of Service" },
  { label: "Receiving Gifts" },
  { label: "Quality Time" },
  { label: "Physical Touch" },
].map((jar) => ({
  containerLabel: jar.label,
  categories: [
    {
      categoryLabel: "G",
      hexColor: colors.maybe,
      percent: 50,
    },
    {
      categoryLabel: "R",
      hexColor: colors.maybe,
      percent: 50,
    },
  ],
}));
