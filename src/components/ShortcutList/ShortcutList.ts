import templateHtml from "./ShortcutList.html?raw";
import {
  ActionTrigger,
  addShortcut,
  shortcuts,
  Trigger,
} from "../../utils/keyboardShortcuts";
import { defineCustomElt, queryElt } from "../componentUtils";
import { cssUtilsSheet } from "../../styles/cssUtils";

export const selectors = {
  dialog: ".dialog",
  closeBtn: ".close-btn",
  toggleBtn: ".toggle-btn",
  placeholder: ".shortcuts-list-container",
};

export class ShortcutsList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
    this.shadowRoot!.adoptedStyleSheets = [cssUtilsSheet];
  }

  connectedCallback() {
    this.setupEventListeners();
    this.renderShortcuts();
  }

  private setupEventListeners() {
    const closeBtn = queryElt(this.shadowRoot, selectors.closeBtn);
    const toggleBtn = queryElt(this.shadowRoot, selectors.toggleBtn);

    closeBtn?.addEventListener("click", () => this.close());
    toggleBtn?.addEventListener("click", () => this.open());

    addShortcut({
      shortcut: shortcuts.help.viewShortcuts,
      action: () => {
        this.toggle();
      },
    });
  }

  private formatTrigger(keys: string[]): string {
    return keys
      .map((key) => {
        // Use cross-platform labels
        if (key === "Meta") return this.isMac() ? "⌘" : "Alt";
        if (key === "Shift") return "⇧";
        if (key === "Alt") return this.isMac() ? "⌥" : "Alt";
        if (key === "Control") return this.isMac() ? "⌃" : "Ctrl";
        return key;
      })
      .join("+");
  }

  private isMac(): boolean {
    return navigator.userAgent.toUpperCase().includes("MAC");
  }

  private renderShortcuts() {
    const content = queryElt(this.shadowRoot, selectors.placeholder);
    if (!content) return;

    const html = Object.entries(shortcuts)
      .map(
        ([category, items]: [string, any]) => `
      <div class="category">
        <h3 class="category-title">${category}</h3>
        <dl class="shortcuts-list">
          ${Object.entries(items)
            .map(
              ([key, { triggers, description }]: [string, any]) => `
              <dl>${description}</dl>
              <dt>
                ${triggers
                  .map(
                    (t: Trigger) => `
                  <kbd class="key">${this.formatTrigger(t.trigger)}</kbd>
                `,
                  )
                  .join("")}
              </dt>
          `,
            )
            .join("")}
        </div>
      </dl>
    `,
      )
      .join("");

    content.innerHTML = html;
  }

  public open() {
    this.getDialogElt()?.showModal();
  }

  public close() {
    this.getDialogElt()?.close();
  }

  public toggle() {
    const isOpen = this.getDialogElt()?.open;
    isOpen ? this.close() : this.open();
  }

  private getDialogElt() {
    return queryElt<HTMLDialogElement>(this.shadowRoot, selectors.dialog);
  }
}

export const shortcutsListTag = "shortcuts-list";
defineCustomElt(shortcutsListTag, ShortcutsList);
