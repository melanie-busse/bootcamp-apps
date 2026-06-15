import {createCharacterCard} from "./components/CharacterCard/CharacterCard.js";
import {createNavButton} from "./components/NavButton/NavButton.js";
import {createNavPagination} from "./components/NavPagination/NavPagination.js";
import {createMobileSearchButton, createSearchbar} from "./components/SearchBar/SearchBar.js";

const cardContainer = document.querySelector('[data-js="card-container"]');
const searchBarContainer = document.querySelector('[data-js="search-bar-container"]');
const mobileSearchBarContainer = document.querySelector('[data-js="mobile-search-button-container"]');
const navigation = document.querySelector('[data-js="navigation"]');

// States
let page = 1;
let maxPage = 1;
let nextUrl = null;
let prevUrl = null;
let prevButton;
let nextButton;
let pagination;
let searchQuery = "";
let url = `https://rickandmortyapi.com/api/character?page=${page}`;

initNavigation();
initSearchbar();
fetchCharacters(url);

function initNavigation() {
  prevButton = createNavButton("previous", "button--prev", "button-prev");
  pagination = createNavPagination();
  nextButton = createNavButton("next", "button--next", "button-next");

  prevButton.addEventListener("click", handlePrevButton);
  nextButton.addEventListener("click", handleNextButton);

  navigation.append(prevButton, pagination, nextButton);
}

function initSearchbar(){
    const searchbar = createSearchbar();
    searchbar.addEventListener("submit", handleSearchbar);
    searchBarContainer.append(searchbar);

    const mobileSearchButton = createMobileSearchButton();
    mobileSearchButton.addEventListener("click", () => {
        searchBarContainer.classList.add("visible");
    });
    mobileSearchBarContainer.append(mobileSearchButton);
}

async function fetchCharacters(url) {
  const response = await fetch(url);
  const data = await response.json();

  setStates(url, data.info);
  renderCharacters(data.results);
  renderPagination();
}

async function setStates(url, info) {
  page = getPageFromUrl(url);
  nextUrl = info.next;
  prevUrl = info.prev;
  maxPage = info.pages;
}

async function renderCharacters(results) {
  cardContainer.innerHTML = "";

  results.forEach((result) => {
    cardContainer.append(createCharacterCard(result));
  });
}

function renderPagination() {
  pagination.textContent = `${page}/${maxPage}`;
  prevButton.disabled = !prevUrl;
  if (!prevUrl) {
    prevButton.classList.add("hidden");
  } else {
    prevButton.classList.remove("hidden");
  }
  nextButton.disabled = !nextUrl;
  if (!nextUrl) {
    nextButton.classList.add("hidden");
  } else {
    nextButton.classList.remove("hidden");
  }
}

function handlePrevButton() {
  if (prevUrl) {
    fetchCharacters(prevUrl);
  }
}

function handleNextButton() {
  if (nextUrl) {
    fetchCharacters(nextUrl);
  }
}

function handleSearchbar(event) {
  event.preventDefault();
  const input = event.target.querySelector("input");
  searchQuery = input.value;
  page = 1;
  url = `https://rickandmortyapi.com/api/character?page=${page}&name=${encodeURIComponent(
    searchQuery
  )}`;
  fetchCharacters(url);
}

function getPageFromUrl(urlString){
    const url = new URL(urlString);
    return parseInt(url.searchParams.get('page')) || 1;
}