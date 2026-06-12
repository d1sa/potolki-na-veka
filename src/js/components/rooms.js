import { qs, qsa } from "../utils/dom.js";

const AUTOPLAY_DURATION = 6500;

export function initRooms() {
  const section = qs("[data-rooms]");
  if (!section) return;

  const items = qsa("[data-room-item]", section);
  const visual = qs("[data-rooms-visual]", section);
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let autoplayTimer = null;

  const syncItemHeights = () => {
    items.forEach((item) => {
      const details = qs(".rooms-list__details", item);
      const inner = qs(".rooms-list__details-inner", item);
      const heading = qs(".rooms-list__heading", item);
      if (!details || !inner || !heading) return;

      const itemStyles = getComputedStyle(item);
      const detailsStyles = getComputedStyle(details);
      const verticalChrome =
        (parseFloat(itemStyles.paddingTop) || 0) +
        (parseFloat(itemStyles.paddingBottom) || 0) +
        (parseFloat(itemStyles.borderTopWidth) || 0) +
        (parseFloat(itemStyles.borderBottomWidth) || 0);
      const detailsGap = parseFloat(detailsStyles.marginTop) || 0;
      const collapsedHeight = heading.offsetHeight + verticalChrome;
      const expandedHeight = collapsedHeight + detailsGap + inner.scrollHeight;

      item.style.setProperty("--rooms-item-collapsed-height", `${collapsedHeight}px`);
      item.style.setProperty("--rooms-item-expanded-height", `${expandedHeight}px`);
    });
  };

  const getActiveIndex = () => {
    const activeIndex = items.findIndex((item) => item.classList.contains("rooms-list__item--active"));
    return activeIndex >= 0 ? activeIndex : 0;
  };

  const stopAutoplay = () => {
    if (!autoplayTimer) return;

    window.clearTimeout(autoplayTimer);
    autoplayTimer = null;
  };

  const startAutoplay = () => {
    stopAutoplay();

    if (items.length < 2 || reducedMotionQuery.matches || document.hidden) return;

    autoplayTimer = window.setTimeout(() => {
      const nextIndex = (getActiveIndex() + 1) % items.length;
      activate(items[nextIndex]);
    }, AUTOPLAY_DURATION);
  };

  const activate = (activeItem) => {
    syncItemHeights();

    items.forEach((item) => {
      const isActive = item === activeItem;
      const details = qs(".rooms-list__details", item);

      item.classList.toggle("rooms-list__item--active", isActive);
      item.setAttribute("aria-expanded", String(isActive));
      details?.setAttribute("aria-hidden", String(!isActive));
    });

    if (!visual || !activeItem.dataset.roomImage) return;

    visual.src = activeItem.dataset.roomImage;
    visual.alt = activeItem.dataset.roomImageAlt || "";

    startAutoplay();
  };

  section.style.setProperty("--rooms-progress-duration", `${AUTOPLAY_DURATION}ms`);

  items.forEach((item) => {
    item.addEventListener("click", (event) => {
      if (item.classList.contains("rooms-list__item--active")) return;

      event.preventDefault();
      activate(item);
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAutoplay();
      return;
    }

    startAutoplay();
  });

  reducedMotionQuery.addEventListener?.("change", startAutoplay);
  syncItemHeights();
  startAutoplay();
  window.addEventListener("resize", syncItemHeights);
  window.addEventListener("load", syncItemHeights, { once: true });
  document.fonts?.ready.then(syncItemHeights);
}
