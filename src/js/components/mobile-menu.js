import { qs, qsa } from "../utils/dom.js";

export function initMobileMenu() {
  const mobileMenu = qs("[data-mobile-menu]");
  const openMenuButton = qs("[data-menu-open]");
  const closeMenuButton = qs("[data-menu-close]");
  const mobileServices = qs(".mobile-services");
  const mobileServicesTrigger = qs(".mobile-services-trigger");

  const open = () => {
    if (!mobileMenu || !openMenuButton) return;

    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    openMenuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    closeMenuButton?.focus();
  };

  const close = () => {
    if (!mobileMenu || !openMenuButton) return;

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    openMenuButton.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  openMenuButton?.addEventListener("click", open);
  closeMenuButton?.addEventListener("click", close);

  mobileMenu?.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      close();
    }
  });

  qsa("a", mobileMenu).forEach((link) => {
    link.addEventListener("click", close);
  });

  mobileServicesTrigger?.addEventListener("click", () => {
    const isOpen = mobileServices?.classList.toggle("is-open");
    mobileServicesTrigger.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  return { close, open };
}
