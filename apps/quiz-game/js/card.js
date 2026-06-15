document.addEventListener("click", (event) => {
    if (event.target.closest('[data-js="button__bookmark"]')) {
        const button = event.target.closest('[data-js="button__bookmark"]');
        const img = button.querySelector('.bookmark__image');

        const isBookmarked = button.toggleAttribute('data-bookmarked');
        const isBookmarkPage = location.pathname.includes('bookmarks.html');
        const card = button.closest('.question__card');

        if(isBookmarkPage){
            card.remove();
        } else {
            // Icon je nach State tauschen
            img.src = isBookmarked
                ? "./assets/icons/bookmark_checked.png"
                : "./assets/icons/bookmark_plus.png";
            img.alt = isBookmarked
                ? "bookmark checked"
                : "add to bookmarks";
        }
    }

    if(event.target.closest('[data-js="buttonAnswers"]')){
        const selectedButton = event.target.closest('[data-js="buttonAnswers"]');

        if(selectedButton) {
            selectedButton.classList.add("button--selected");
            selectedButton.disabled = true;

            const card = selectedButton.closest('.question__card');
            const allAnswerButtons = card.querySelectorAll('[data-js="buttonAnswers"]');

            allAnswerButtons.forEach(button => {
                if(button !== selectedButton){
                    button.disabled = true;
                    button.style.opacity = '0.6';
                }
            });
        }
    }


    if(event.target.closest('[data-js="showAnswer"]')){
        const showButton = event.target.closest('[data-js="showAnswer"]');

        const card = showButton.closest('.question__card');

        const correctAnswer = card.dataset.correctAnswer;

        const answerButtons = card.querySelectorAll(
            '[data-js="buttonAnswers"]'
        );

        const isVisible = showButton.dataset.visible ==="true";

        if(!isVisible) {
            const selectedButton = card.querySelector('.button--selected');

            answerButtons.forEach((button) => {
                if(button.textContent.trim() === correctAnswer){
                    button.classList.remove("button--selected", "button--correct", "button--notCorrect");
                    button.classList.add("button--correct");
                    button.style.opacity = '1';
                    showButton.textContent = "Hide answer";
                } else {
                    if(button === selectedButton){
                        button.classList.remove("button--selected", "button--correct", "button--notCorrect");
                        button.classList.add("button--notCorrect");
                    }
                }
                button.disabled = true;
            });

            showButton.dataset.visible = "true";
        } else {
            answerButtons.forEach((button) => {
                if(button.textContent.trim() === correctAnswer){
                    button.classList.remove("button--correct");
                    showButton.textContent = "Show answer";
                } else {
                    button.classList.remove("button--selected", "button--correct", "button--notCorrect");
                    button.style.opacity = '1';
                }
                button.disabled = false;
            });
            showButton.dataset.visible = "false";
        }
    }
})

function createCard(card) {
    const main = document.querySelector("main");
    const section = createSection({
        classList: ["question__card", "quiz-card"],
        ariaLabeledBy: card.id
    });

    section.setAttribute("data-correct-answer", card.answer);
    main.appendChild(section);

    section.appendChild(
        createDivBookmark(["question__area"], card.bookmarked));

    const divContent = createDiv({
        classList: ["question__content"]
    });
    section.appendChild(divContent);

    divContent.appendChild(
        createParagraph({
            text: card.question,
            classList: ["question__text"]
    }));

    divContent.appendChild(createButtonAnswers(card));

    // ✅ UPLOAD-BILD (Base64) or standard

    const imageElement = createImage({
        icon: card.imageSrc || card.imageAnswer || "images/quizwindow.jpg",  // Priorität!
        alt: card.answer,
        classList: ["question__image"]
    });
    section.appendChild(imageElement);
}

function createDivBookmark(classList, bookmarked){
    const div = createDiv({classList:classList});

    const button = createButton({
        classList: ["button__bookmark"],
        ariaLabel: "Toggle bookmark",
        dataJs: "button__bookmark"
    });

    let icon;
    let alt;

    if (bookmarked){
        button.setAttribute("data-bookmarked", "");
        icon = "icons/bookmark_checked.png";
        alt = "bookmark checked";
    } else {
        icon = "icons/bookmark_plus.png";
        alt = "add to bookmarks";
    }

    button.appendChild(createImage({
        icon: icon,
        alt: alt,
        classList: ["bookmark__image"]
    }));

    div.appendChild(button);

    return div;
}

function createButtonAnswers(card){
    const divButtons = createDiv({
        classList: ["question__buttons"]
    });

    const divButtonRow1 = createDiv({
        classList: ["question__buttons-row"]
    });
    divButtons.appendChild(divButtonRow1);

    const button1Left = createButton({
        text: card.possibleAnswers[0],
        classList: ["button", "button--text"],
        ariaLabel: "Answer: " + card.possibleAnswers[0],
        dataJs: "buttonAnswers"
    });

    divButtonRow1.appendChild(button1Left);

    const button1Right = createButton({
        text: card.possibleAnswers[1],
        classList: ["button", "button--text"],
        ariaLabel: "Answer: " + card.possibleAnswers[1],
        dataJs: "buttonAnswers"
    });
    divButtonRow1.appendChild(button1Right);

    const divButtonRow2 = createDiv({
        classList: ["question__buttons-row"]
    });
    divButtons.appendChild(divButtonRow2);

    const button2Left = createButton({
        text: card.possibleAnswers[2],
        classList: ["button", "button--text"],
        ariaLabel: "Answer: " + card.possibleAnswers[2],
        dataJs: "buttonAnswers"
    });
    divButtonRow2.appendChild(button2Left);

    const button2Right = createButton({
        text: card.possibleAnswers[3],
        classList: ["button", "button--text"],
        ariaLabel: "Answer: " + card.possibleAnswers[3],
        dataJs: "buttonAnswers"
    });
    divButtonRow2.appendChild(button2Right);

    const divButtonRow3 = createDiv({
        classList: ["question__buttons-row"]
    });
    divButtons.appendChild(divButtonRow3);

    const button3 = createButton({
        text: "Show Answer",
        classList: ["button", "button--text"],
        ariaLabel: "Show answer",
        dataJs: "showAnswer"
    });
    divButtonRow3.appendChild(button3);

    return divButtons;
}
