export const colors = {
  yes: "#44ff44",
  maybe: "#ffdd44",
  no: "#ff4444",
};

export interface JarAttrs {
  label: string;
  fillleft: number;
  fillright: number;
  colorleft: string;
  colorright: string;
}

export const defaultJarAttrs: JarAttrs = {
  label: "New Jar",
  fillleft: 50,
  fillright: 50,
  colorleft: colors.maybe,
  colorright: colors.maybe,
};
