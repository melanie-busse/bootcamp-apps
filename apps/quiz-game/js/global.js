const bodyElement = document.querySelector('[data-js="body"]');
function initDarkMode() {
    const savedDarkMode = localStorage.getItem("darkMode");
    const isDark = savedDarkMode === "true";

    bodyElement.classList.toggle("dark", isDark);
    // Button-State nur falls Toggle auf index vorhanden (optional)
    const toggleBtn = document.querySelector('[data-js="toggle-button"]');
    if (toggleBtn) {
        toggleBtn.dataset.state = isDark ? "on" : "off";
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDarkMode);
} else {
    initDarkMode();
}


function createSection(
    {classList, ariaLabeledBy} = {}) {
    const section = document.createElement("section");
    section.classList.add(...classList);
    section.setAttribute("aria-labelledby", ariaLabeledBy);
    section.setAttribute("role", "group");

    return section;
}

function createDiv(
    {classList = []} = {}){
    const div = document.createElement("div");
    div.classList.add(...classList);

    return div;
}

function createButton(
    {text = "", classList = [], ariaLabel = "", dataJs = ""} = {}){
    const button = document.createElement("button");

    button.classList.add(...classList);
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    if (dataJs) button.setAttribute("data-js", dataJs);
    button.textContent = text;
    return button;
}

function createImage(
    {icon = "", alt = "", classList= []} = {}){
    const image = document.createElement("img");

    // ✅ Base64 CHECK!
    if (icon.startsWith('data:')) {
        image.src = icon;  // Base64
    } else {
        image.src = `./assets/${icon}`;
    }

    image.classList.add(...classList);
    image.alt = alt;
    image.setAttribute("title", alt);

    return image;
}

function createParagraph(
    {text, classList = [], id = ""} = {}) {
    const paragraph = document.createElement("p");
    paragraph.classList.add(...classList);
    if (paragraph) paragraph.id = id;
    paragraph.innerHTML = text;

    return paragraph;
}

function createA(
    {hrefAElement, classListAElement, arialLabel} = {}) {
    const href = document.createElement("a");
    href.href = hrefAElement;
    href.classList.add(...classListAElement);
    href.setAttribute("aria-label", arialLabel);

    return href;
}
