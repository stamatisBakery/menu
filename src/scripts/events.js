const ACTIVE_CLASS = "active_lang_button";
const INACTIVE_CLASS = "inactive_lang_button";

function applyLanguage(lang) {
  // Update button styles
  document.querySelectorAll("[data-lang]").forEach(function (button) {
    if (button.getAttribute("data-lang") === lang) {
      button.classList.remove(INACTIVE_CLASS);
      button.classList.add(ACTIVE_CLASS);
    } else {
      button.classList.remove(ACTIVE_CLASS);
      button.classList.add(INACTIVE_CLASS);
    }
  });

  // Update translated text
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    const key = el.getAttribute("data-i18n");
    const text =
      (translations[lang] && translations[lang][key]) ||
      (translations["en"] && translations["en"][key]);
    if (text) {
      el.textContent = text;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Attach click listeners
  document.querySelectorAll("[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      const lang = button.getAttribute("data-lang");
      localStorage.setItem("selectedLang", lang);
      applyLanguage(lang);

      const animatedElements = document.querySelectorAll(
        '.list, .menu_header, .info_container, [class*="animate-"]',
      );

      animatedElements.forEach(function (el) {
        // Temporarily disable the animation
        el.style.animation = "none";

        // Force a browser reflow to register the change
        void el.offsetHeight;

        // Clear the inline style so the CSS animation applies again
        el.style.animation = "";
      });
    });
  });

  // Apply saved language (or default to English)
  const savedLang = localStorage.getItem("selectedLang") || "en";
  applyLanguage(savedLang);

  // Re-apply on every navigation to this page (not just bfcache restores)
  window.addEventListener("pageshow", function () {
    const lang = localStorage.getItem("selectedLang") || "en";
    applyLanguage(lang);
  });

  // --- ScrollSpy & Horizontal Nav Auto-Scroll ---
  const navList = document.querySelector("nav ul");
  const navItems = document.querySelectorAll("nav ul li");
  const menuHeaders = document.querySelectorAll(".menu_header");

  let currentActiveId = "coffee"; // Default starting category

  window.addEventListener("scroll", () => {
    let newActiveId = currentActiveId;
    const scrollPos = window.scrollY;

    // Determine which section is currently at the top of the viewport
    menuHeaders.forEach((header) => {
      // Trigger threshold: accounts for sticky nav height + top margin (~120px)
      if (header.id && scrollPos >= header.offsetTop - 120) {
        newActiveId = header.id;
      }
    });

    // If the window height + scroll position is near the total document height...
    if (
      window.innerHeight + Math.round(scrollPos) >=
      document.body.offsetHeight - 10
    ) {
      // Grab the very last header element and force its ID to be active
      const lastHeader = menuHeaders[menuHeaders.length - 1];
      if (lastHeader && lastHeader.id) {
        newActiveId = lastHeader.id;
      }
    }

    // If the active section has changed, update the UI
    if (newActiveId !== currentActiveId) {
      currentActiveId = newActiveId;

      navItems.forEach((item) => {
        const anchor = item.querySelector("a");
        if (anchor && anchor.getAttribute("data-target") === currentActiveId) {
          // Set to Active
          item.classList.remove("inactive_nav_item");
          item.classList.add("active_nav_item");

          // Smoothly center this item in the horizontal scrollbar
          const scrollLeftPos =
            item.offsetLeft - navList.offsetWidth / 2 + item.offsetWidth / 2;
          navList.scrollTo({
            left: scrollLeftPos,
            behavior: "smooth",
          });
        } else {
          // Set to Inactive
          item.classList.remove("active_nav_item");
          item.classList.add("inactive_nav_item");
        }
      });
    }
  });

  // Optional Bonus: Allow clicking the nav items to scroll instantly to that category
  navItems.forEach((item) => {
    const anchor = item.querySelector("a");
    if (anchor) {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("data-target");
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Scroll down to the category, offsetting for the sticky navbar height
          const offsetTop = targetSection.offsetTop - 100;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    }
  });
});
