export function createNavPagination() {
    const spanPagination = document.createElement("span");
    spanPagination.className = "navigation__pagination";
    spanPagination.dataset.js = "pagination";

    return spanPagination;
}
