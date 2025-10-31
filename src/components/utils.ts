/*
 * makes element attrs the source of truth
 * by defining default getters/setters for obj
 *
 * if an attr is undefined, the getter returns the default value of the instance variable
 */
export function mapPropertiesToAttribute<T extends HTMLElement>(
  obj: T,
  attrsToMap: string[],
) {
  attrsToMap.forEach((f) => {
    const defaultVal = obj[f] as unknown;

    Object.defineProperty(obj, f, {
      get() {
        return this.getAttribute(f) ?? defaultVal;
      },

      set(v) {
        this.setAttribute(f, v);
      },
    });
  });
}

export function defineCustomElt(tag: string, elt: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, elt);
  }
}

export function triggerCustomEvent<T>(
  self: HTMLElement,
  eventName: string,
  eventDetails: T,
) {
  const customEvent = new CustomEvent<T>(eventName, {
    bubbles: true,
    composed: true,
    detail: {
      ...eventDetails,
    },
  });
  self.dispatchEvent(customEvent);
}

/**
 * logs error if container or element is not found
 */
export function queryElt<Elt extends Element>(
  container: ShadowRoot | Document | null,
  selector: string,
) {
  if (!container) {
    console.trace("Unable to find container ", { container, selector });
    return null;
  }

  const elt = container.querySelector<Elt>(selector);

  if (!elt) {
    console.trace("Unable to find element ", selector);
    return null;
  }

  return elt;
}
