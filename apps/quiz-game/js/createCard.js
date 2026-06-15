for (const navLink of nav) {
    createNav(navLink);
}

let cards = [];

const getWarningColor = (charsLeft) =>
    charsLeft <= 10 ? 'var(--counter-warning-high)'
        : charsLeft <= 30 ? 'var(--counter-warning-medium)'
            : 'var(--counter-warning-low)';

const form = document.querySelector("[data-js='form']");

document.addEventListener('input', (event) => {
    const input = event.target.matches('[data-js*="possibleAnswer"],[data-js="question"],[data-js="answer"]')
        ? event.target
        : event.target.closest('[data-js*="possibleAnswer"],[data-js="question"],[data-js="answer"]');

    if (!input) return;

    const maxLength = input.maxLength;
    const currentLength = input.value.length;
    const charactersLeft = maxLength - currentLength;

    const counter = input.parentElement.querySelector('.characters--left');
    counter.textContent = `${charactersLeft} characters left`;
    counter.style.color = getWarningColor(charactersLeft);
});

function initFileUpload() {
    const form = document.querySelector('[data-js="form"]');
    const fileInput = document.getElementById('imageUpload');
    const fileNameSpan = document.querySelector('[data-js="file-name"]');
    const previewDiv = document.querySelector('[data-js="image-preview"]');

    const previewImage = previewDiv.querySelector('img') ||
        document.createElement('img');

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameSpan.textContent = file.name;
            const reader = new FileReader();

            reader.onload = (ev) => {
                previewImage.src = ev.target.result;
                previewImage.alt = file.name;
                previewImage.style.maxWidth = '200px';
                previewImage.style.display = 'block';
                if (!previewDiv.contains(previewImage)) {
                    previewDiv.appendChild(previewImage);
                }
            };

            reader.readAsDataURL(file);
        } else {
            fileNameSpan.textContent = 'No file selected';
            previewImage.style.display = 'none';
        }
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formElements = event.target.elements;

        // Base64-Image
        const file = formElements.imageUpload.files[0];
        let imageSrc = 'images/quizwindow.jpg';
        if (file) {
            imageSrc = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        }

        const card = {
            question: formElements.question.value,
            answer: formElements.answer.value,
            possibleAnswers: [
                formElements.possibleAnswer1.value,
                formElements.possibleAnswer2.value,
                formElements.possibleAnswer3.value,
                formElements.possibleAnswer4.value
            ].filter(ans => ans.trim()),
            imageSrc: imageSrc
        };

        cards.push(card);
        renderCards();

        form.reset();
    });

    form.addEventListener("reset", (event) => {
        event.preventDefault();

        const textInputs = form.querySelectorAll('input[type="text"]');
        textInputs.forEach(input => input.value = '');


        // File-Upload reset
        const fileNameSpan = document.querySelector('[data-js="file-name"]');
        const previewDiv = document.querySelector('[data-js="image-preview"]');
        fileNameSpan.textContent = 'No image selected';
        previewDiv.innerHTML = '';

        // Counters reset
        const allCounters = form.querySelectorAll('.characters--left');
        allCounters.forEach(counter => {
            counter.textContent = '150 characters left';
            counter.style.color = getWarningColor(150);
        });
    });
}

function renderCards() {
    const main = document.querySelector("main");

    // 1. ALLE alten Cards löschen
    const oldCards = main.querySelectorAll('.question__card');
    oldCards.forEach(card => card.remove());

    // 2. cards[] komplett neu rendern
    cards.forEach(cardObj => {
        createCard(cardObj);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initFileUpload();
    renderCards();
});
