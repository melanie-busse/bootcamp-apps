export function createNavButton(buttonText, buttonClass, dataJS) {
    const button = document.createElement("button");
    button.className = `button ${buttonClass}`;
    button.dataset.js = dataJS;
    button.textContent = buttonText;

    return button;
}