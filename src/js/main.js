import { initFaq } from "./components/faq.js";
import { initHeader } from "./components/header.js";
import { initMobileMenu } from "./components/mobile-menu.js";
import { initReveal } from "./components/reveal.js";
import { initServicesDropdown } from "./components/services-dropdown.js";

const mobileMenu = initMobileMenu();
const servicesDropdown = initServicesDropdown();

initHeader();
initFaq();
initReveal();

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  mobileMenu.close();
  servicesDropdown.close();
});
