const ACTIVE_CLASS = "active_lang_button";
const INACTIVE_CLASS = "inactive_lang_button";

function applyLanguage(lang) {
    // Update button styles
    document.querySelectorAll("[data-lang]").forEach(function(button) {
        if (button.getAttribute("data-lang") === lang) {
            button.classList.remove(INACTIVE_CLASS);
            button.classList.add(ACTIVE_CLASS);
        } else {
            button.classList.remove(ACTIVE_CLASS);
            button.classList.add(INACTIVE_CLASS);
        }
    });

    // Update translated text
    document.querySelectorAll("[data-i18n]").forEach(function(el) {
        const key = el.getAttribute("data-i18n");
        const text =
            (translations[lang] && translations[lang][key]) ||
            (translations["en"] && translations["en"][key]);
        if (text) {
            el.textContent = text;
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    // Attach click listeners
    document.querySelectorAll("[data-lang]").forEach(function(button) {
        button.addEventListener("click", function() {
            const lang = button.getAttribute("data-lang");
            localStorage.setItem("selectedLang", lang);
            applyLanguage(lang);
        });
    });

    // Apply saved language (or default to English)
    const savedLang = localStorage.getItem("selectedLang") || "en";
    applyLanguage(savedLang);

    // Re-apply on every navigation to this page (not just bfcache restores)
    window.addEventListener("pageshow", function() {
        const lang = localStorage.getItem("selectedLang") || "en";
        applyLanguage(lang);
    });
});


