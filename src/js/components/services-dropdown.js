import { qs } from "../utils/dom.js";

export function initServicesDropdown() {
  const dropdown = qs(".nav-dropdown");
  const dropdownButton = qs(".dropdown-trigger");
  let dropdownCloseTimer;
  let isPinnedOpen = false;

  const close = () => {
    window.clearTimeout(dropdownCloseTimer);
    isPinnedOpen = false;
    dropdown?.classList.remove("is-open");
    dropdownButton?.setAttribute("aria-expanded", "false");
  };

  const open = ({ pinned = false } = {}) => {
    window.clearTimeout(dropdownCloseTimer);
    isPinnedOpen = isPinnedOpen || pinned;
    dropdown?.classList.add("is-open");
    dropdownButton?.setAttribute("aria-expanded", "true");
  };

  const scheduleClose = () => {
    if (isPinnedOpen) return;

    window.clearTimeout(dropdownCloseTimer);
    dropdownCloseTimer = window.setTimeout(close, 220);
  };

  dropdownButton?.addEventListener("click", (event) => {
    event.stopPropagation();

    if (isPinnedOpen) {
      close();
      return;
    }

    open({ pinned: true });
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

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });

  return { close, open };
}
