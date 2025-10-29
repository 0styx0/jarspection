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
  colorleft: "",
  colorright: "",
};
