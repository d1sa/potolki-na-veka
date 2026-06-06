import { qs } from "../utils/dom.js";

export function initHeader() {
  const header = qs("[data-header]");
  const mobileStickyActions = qs(".mobile-sticky-actions");

  const updateHeader = () => {
    if (!header) return;

    header.classList.toggle("is-scrolled", window.scrollY > 8);
    mobileStickyActions?.classList.toggle("is-visible", window.scrollY > 520);
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}
