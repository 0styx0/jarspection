export class BaseComponent extends HTMLElement {
  static mirroredProps: string[] = [];

  constructor() {
    super();
    const def = new.target;

    if (def.mirroredProps) {
      this.mapPropertiesToAttribute(def.mirroredProps);
    }
  }

  private mapPropertiesToAttribute(attributes: string[]) {
    attributes.forEach((f) => {
      Object.defineProperty(this, f, {
        get() {
          return this.getAttribute(f);
        },

        set(v) {
          this.setAttribute(f, v);
        },
      });
    });
  }
}
