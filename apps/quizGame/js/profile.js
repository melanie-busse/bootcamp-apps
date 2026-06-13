for (const navLink of nav) {
    createNav(navLink);
}

const toggleModeButton = document.querySelector('[data-js="toggle-button"]');

toggleModeButton.addEventListener("click", () => {
    const isDark = bodyElement.classList.toggle("dark");
    localStorage.setItem("darkMode", isDark ? "true" : "false");

    toggleModeButton.dataset.state = isDark ? "on" : "off";
});
