function createNav(navObject){
    const nav = document.querySelector("nav");

    const link = createA(
        {
            hrefAElement: navObject.href,
            classListAElement: ["nav__link", "nav__link__notchecked"],
            arialLabel: navObject.ariaLabel}
    );

    // Aktuelle Seite checken
    const currentPage = window.location.pathname.split('/').pop();
    const isActive = navObject.href === currentPage;

    if (isActive) {
        link.classList.replace("nav__link__notchecked", "nav__link__checked");
    }

    const imgClasses = isActive ? ["nav__image__bookmark"] : ["nav__image"];

    link.appendChild(createImage({
        icon: navObject.image,
        alt: navObject.alt,
        classList: imgClasses
    }));

    nav.appendChild(link);

    return nav;
}