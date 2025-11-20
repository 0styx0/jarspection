import { ApiCategoryItem, ApiContainer, colors, HexColorValue } from "../api";

let jarNum = 0;

export class Container implements ApiContainer {
  id = `new-jar-${jarNum++}`;
  containerLabel = "New Jar";
  categories = [
    {
      categoryLabel: "G",
      hexColor: colors.maybe as HexColorValue,
      percent: 50,
    },
    {
      categoryLabel: "R",
      hexColor: colors.maybe as HexColorValue,
      percent: 50,
    },
  ];

  constructor() {
    return this
  }
  setId(id: string) {
    this.id = id
    return this
  }
  setContainerLabel(containerLabel: string) {
    this.containerLabel = containerLabel
    return this
  }
  setCategories(categories: ApiCategoryItem[]) {
    this.categories = categories
    return this
  }
}
