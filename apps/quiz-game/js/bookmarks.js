
for (const card of questions) {
    if (card.bookmarked){
        createCard(card);
    }
}

for (const navLink of nav) {
    createNav(navLink);
}