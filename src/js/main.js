import { initFaq } from "./components/faq.js";
import { initHeader } from "./components/header.js";
import { initHeroWorksPreview } from "./components/hero-works-preview.js";
import { initMaterialsCarousel } from "./components/materials-carousel.js";
import { initMobileMenu } from "./components/mobile-menu.js";
import { initReveal } from "./components/reveal.js";
import { initRooms } from "./components/rooms.js";
import { initServicesDropdown } from "./components/services-dropdown.js";
import { initTimelineCarousel } from "./components/timeline-carousel.js";

const mobileMenu = initMobileMenu();
const servicesDropdown = initServicesDropdown();
const heroWorksPreview = initHeroWorksPreview();

initHeader();
initFaq();
initMaterialsCarousel();
initTimelineCarousel();
initRooms();
initReveal();

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  mobileMenu.close();
  servicesDropdown.close();
  heroWorksPreview.close();
});
