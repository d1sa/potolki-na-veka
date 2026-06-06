import { qs } from "../utils/dom.js";

export function initHeroWorksPreview() {
  const preview = qs("[data-hero-works]");
  if (!preview) return { close: () => {} };

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  let lastPointerType = "";

  const close = () => {
    preview.classList.remove("is-open");
    preview.setAttribute("aria-expanded", "false");
  };

  const open = () => {
    preview.classList.add("is-open");
    preview.setAttribute("aria-expanded", "true");
  };

  preview.setAttribute("aria-expanded", "false");

  const shouldUseTapInteraction = () => {
    if (!lastPointerType) return !canHover.matches;
    return lastPointerType !== "mouse" || !canHover.matches;
  };

  const handleTapClick = (event) => {
    const shouldUseTap = shouldUseTapInteraction();
    if (!shouldUseTap) return;

    const isOpen = preview.classList.contains("is-open");

    if (!isOpen) {
      event.preventDefault();
      open();
    }
  };

  preview.addEventListener("pointerdown", (event) => {
    lastPointerType = event.pointerType;
  });

  preview.addEventListener("click", (event) => {
    handleTapClick(event);
  });

  document.addEventListener("pointerdown", (event) => {
    const shouldCloseFromTap = event.pointerType !== "mouse" || !canHover.matches;
    if (!shouldCloseFromTap || preview.contains(event.target)) return;
    close();
  });

  canHover.addEventListener("change", close);

  return { close, open };
}
