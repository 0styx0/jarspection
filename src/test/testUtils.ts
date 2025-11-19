import { expect } from "vitest";
import { queryElt } from "../components/componentUtils";

export function renderComponent<T extends HTMLElement>(
  tag: string,
  attrs: Record<string, unknown> = {},
) {
  const attrString = Object.entries(attrs).reduce(
    (attrs, [key, value]) => `${attrs} ${key}="${value}"`,
    "",
  );

  const componentHtml = `
      <${tag} ${attrString}>
      </${tag}>
    `;
  document.body.innerHTML = componentHtml;

  return queryElt<T>(document, tag)!;
}

export const queryTestElement = <T extends Element>(
  component: HTMLElement,
  selector: string,
) => {
  return queryTestElements<T>(component, selector).item(0);
};

export const queryTestElements = <T extends Element>(
  component: HTMLElement,
  selector: string,
): NodeListOf<T> => {
  const element = component.shadowRoot?.querySelectorAll<T>(selector);

  expect(element).toBeTruthy();

  return element!;
};
