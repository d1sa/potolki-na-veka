import { BlossomCarousel } from "@blossom-carousel/web";
import "@blossom-carousel/web/style.css";

import { qsa } from "../utils/dom.js";

if (!customElements.get("blossom-carousel")) {
  customElements.define("blossom-carousel", BlossomCarousel);
}

export const initMaterialsCarousel = () => {
  qsa("[data-materials-carousel]").forEach((root) => {
    const carousel = root.querySelector("blossom-carousel");
    const prevButton = root.querySelector("[data-materials-prev]");
    const nextButton = root.querySelector("[data-materials-next]");

    if (!carousel || !prevButton || !nextButton) return;

    prevButton.addEventListener("click", () => {
      if (typeof carousel.prev === "function") {
        carousel.prev();
        return;
      }

      carousel.scrollBy({ left: -carousel.clientWidth, behavior: "smooth" });
    });

    nextButton.addEventListener("click", () => {
      if (typeof carousel.next === "function") {
        carousel.next();
        return;
      }

      carousel.scrollBy({ left: carousel.clientWidth, behavior: "smooth" });
    });
  });
};
