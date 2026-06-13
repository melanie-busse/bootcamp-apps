export function createSearchbar(){
    const formSearchbar = document.createElement("form");
    formSearchbar.className = "search-bar";
    formSearchbar.dataset.js = "search-bar";

    formSearchbar.innerHTML = `<input
              name="query"
              class="search-bar__input"
              type="text"
              placeholder="search characters"
              aria-label="character name"
            />
            <button class="search-bar__button" aria-label="search for character">
              <img
                class="search-bar__icon"
                src="./assets/magnifying-glass.png"
                alt=""
              />
            </button>`;

    return formSearchbar;
}

export function createMobileSearchButton () {
    const mobileSearchButton = document.createElement("button");
    mobileSearchButton.className = "search-bar__button mobile-search__button";
    mobileSearchButton.dataset.js = "mobile-search-button";

    mobileSearchButton.innerHTML = `<img
        class="search-bar__icon"
        src="./assets/magnifying-glass.png"
        alt=""
    />`;

    return mobileSearchButton;
}
