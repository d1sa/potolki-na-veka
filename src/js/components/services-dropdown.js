import { qs } from "../utils/dom.js";

export function initServicesDropdown() {
  const dropdown = qs(".nav-dropdown");
  const dropdownButton = qs(".dropdown-trigger");
  let dropdownCloseTimer;

  const close = () => {
    window.clearTimeout(dropdownCloseTimer);
    dropdown?.classList.remove("is-open");
    dropdownButton?.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    window.clearTimeout(dropdownCloseTimer);
    dropdown?.classList.add("is-open");
    dropdownButton?.setAttribute("aria-expanded", "true");
  };

  const scheduleClose = () => {
    window.clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = window.setTimeout(close, 220);
  };

  dropdownButton?.addEventListener("click", () => {
    const isOpen = dropdown?.classList.toggle("is-open");
    dropdownButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  dropdown?.addEventListener("mouseenter", open);
  dropdown?.addEventListener("mouseleave", scheduleClose);
  dropdown?.addEventListener("focusin", open);
  dropdown?.addEventListener("focusout", scheduleClose);
  dropdownButton?.addEventListener("mouseenter", open);
  dropdownButton?.addEventListener("focus", open);

  document.addEventListener("click", (event) => {
    if (!dropdown?.contains(event.target)) {
      close();
    }
  });

  return { close, open };
}
