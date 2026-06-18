import { qs, qsa } from "../utils/dom.js";

export function initMobileMenu() {
  const mobileMenu = qs("[data-mobile-menu]");
  const openMenuButton = qs("[data-menu-open]");
  const closeMenuButton = qs("[data-menu-close]");
  const mobileServices = qs(".mobile-services");
  const mobileServicesTrigger = qs(".mobile-services-trigger");
  const mobileServicesList = qs(".mobile-services-list");

  const setMenuInert = (isInert) => {
    if (!mobileMenu) return;

    mobileMenu.inert = isInert;
    mobileMenu.toggleAttribute("inert", isInert);
  };

  const setServicesInert = (isInert) => {
    if (!mobileServicesList) return;

    mobileServicesList.inert = isInert;
    mobileServicesList.toggleAttribute("inert", isInert);
  };

  const open = () => {
    if (!mobileMenu || !openMenuButton) return;

    setMenuInert(false);
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    openMenuButton.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
    setTimeout(() => closeMenuButton?.focus({ preventScroll: true }), 0);
  };

  const close = () => {
    if (!mobileMenu || !openMenuButton) return;

    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    openMenuButton.setAttribute("aria-expanded", "false");
    setMenuInert(true);
    mobileServices?.classList.remove("is-open");
    mobileServicesTrigger?.setAttribute("aria-expanded", "false");
    setServicesInert(true);
    document.body.classList.remove("menu-open");
    openMenuButton.focus();
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
    setServicesInert(!isOpen);
  });

  setMenuInert(true);
  setServicesInert(true);

  return { close, open };
}
