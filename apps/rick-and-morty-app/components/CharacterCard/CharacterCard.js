export function createCharacterCard(result) {
    const card = document.createElement("li");
    card.innerHTML = ` <div class="card__image-container">
            <img
              class="card__image"
              src="${result.image}"
              alt="${result.name}"
            />
            <div class="card__image-gradient"></div>
          </div>
          <div class="card__content">
            <h2 class="card__title">${result.name}</h2>
            <dl class="card__info">
              <dt class="card__info-title">Status</dt>
              <dd class="card__info-description">${result.status}</dd>
              <dt class="card__info-title">Type</dt>
              <dd class="card__info-description">${result.type}</dd>
              <dt class="card__info-title">Occurrences</dt>
              <dd class="card__info-description">${result.episode.length}</dd>
            </dl>
          </div>`;
    card.className = "card";

    return card;
}
