import { defineCustomElt } from "../componentUtils";
import templateHtml from "./Navbar.html?raw";

export class Navbar extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: "open" }).innerHTML = templateHtml;
  }
}

export const navbarTag = "page-navbar";
defineCustomElt(navbarTag, Navbar);
