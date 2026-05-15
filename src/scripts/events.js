const ACTIVE_CLASS = "active_lang_button";
const INACTIVE_CLASS = "inactive_lang_button";

function getLangButtons() {
    return document.querySelectorAll("." + ACTIVE_CLASS + ", ." + INACTIVE_CLASS);
}

function applyTranslations(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function(el) {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });
}

function onLangButtonClick(clickedButton) {
    getLangButtons().forEach(function(button) {
        if (button === clickedButton) {
            button.classList.remove(INACTIVE_CLASS);
            button.classList.add(ACTIVE_CLASS);
        } else {
            button.classList.remove(ACTIVE_CLASS);
            button.classList.add(INACTIVE_CLASS);
        }
    });

    const lang = clickedButton.getAttribute("data-lang");
    applyTranslations(lang);
}

document.addEventListener("DOMContentLoaded", function() {
    getLangButtons().forEach(function(button) {
        button.addEventListener("click", function() {
            onLangButtonClick(button);
        });
    });

    // Apply default language on load
    applyTranslations("en");
});
