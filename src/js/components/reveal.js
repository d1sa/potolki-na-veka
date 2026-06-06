import { qsa } from "../utils/dom.js";

export function initReveal() {
  const revealItems = qsa(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 3, 2) * 35}ms`;
    observer.observe(item);
  });
}
