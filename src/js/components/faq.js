import { qsa } from "../utils/dom.js";

export function initFaq() {
  qsa(".faq-item").forEach((item) => {
    const button = item.querySelector("button");
    const icon = button?.querySelector("span");

    button?.addEventListener("click", () => {
      const isOpen = item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(isOpen));
      if (icon) icon.textContent = isOpen ? "−" : "+";
    });
  });
}
