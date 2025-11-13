export const colors = {
  yes: "#44ff44",
  maybe: "#ffdd44",
  no: "#ff4444",
} as const;

export type HexColorValue = (typeof colors)[keyof typeof colors];

export interface CategoryItem {
  // technically this repeats info. but I want to keep api flexible for future
  categoryLabel: string;
  hexColor: HexColorValue;
  /** 0-100 **/
  percent: number;
}

export interface Container {
  containerLabel: string;
  categories: CategoryItem[];
  id: Symbol;
}

export interface ContainerSettings {
  version: string;
  containers: Container[];
}
