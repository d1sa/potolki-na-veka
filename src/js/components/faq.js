import { qsa } from "../utils/dom.js";

export function initFaq() {
  qsa(".faq-item").forEach((item) => {
    const button = item.querySelector("button");

    button?.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });
  });
}
