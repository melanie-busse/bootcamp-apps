// data.js
const questions = [
    {
        id: 1,
        question: 'Which animal has spotted fur and laughs?',
        answer: 'Spotted hyena',
        imageAnswer: './images/animals/tuepfelhyaene.jpg',
        possibleAnswers: ['Axolotl', 'Panther', 'Spotted hyena', 'Lion'],
        bookmarked: true,
    },
    {
        id: 2,
        question: 'Which bird has a long neck and lives in wetlands?',
        answer: 'Swan',
        imageAnswer: './images/animals/swan.jpg',
        possibleAnswers: ['Swan', 'Buzzard', 'Barn owl', 'Penguin'],
        bookmarked: false,
    },
    {
        id: 3,
        question: 'Which animal has red skin and lives in trees?',
        answer: 'Hussar monkey',
        imageAnswer: './images/animals/husarenaffe.jpg',
        possibleAnswers: ['Baboon', 'Hussar monkey', 'Gibbon', 'Waldrapp'],
        bookmarked: true,
    },
    {
        id: 4,
        question: 'Which cockatoo has white and yellow plumage?',
        answer: 'Yellow-crested cockatoo',
        imageAnswer: './images/animals/gelbhauben-kakadu.jpg',
        possibleAnswers: ['Yellow-crested cockatoo', 'Roseate cockatoo', 'Pheasant', 'Puffin'],
        bookmarked: false,
    },
    {
        id: 5,
        question:
            'Which animal has thick white fur in winter and lives in the Arctic?',
        answer: 'Snow hare',
        imageAnswer: './images/animals/schneehase.jpg',
        possibleAnswers: ['Leopard', 'African wild dog', 'Snow hare', 'White rhinoceros'],
        bookmarked: true,
    },
    {
        id: 6,
        question: 'Which animal has large tusks and lives in the sea?',
        answer: 'Walrus',
        imageAnswer: './images/animals/walross.jpg',
        possibleAnswers: ['Humpback whale', 'Beluga whale', 'Axolotl', 'Walrus'],
        bookmarked: false,
    },
    {
        id: 7,
        question: 'Which small marsupial is known for its cheerful smile?',
        answer: 'Quokka',
        imageAnswer: './images/animals/quokka.jpg',
        possibleAnswers: ['Quokka', 'Mandrill', 'Koala', 'Kusu'],
        bookmarked: true,
    },
    {
        id: 8,
        question:
            'Which animal is a large bird of prey that lives on the Falkland Islands?',
        answer: 'Falkland caracara',
        imageAnswer: './images/animals/falklandkaraka.jpg',
        possibleAnswers: ['Emu', 'Falkland caracara', 'Gyrfalcon', 'Pearl owl'],
        bookmarked: false,
    },
    {
        id: 9,
        question: 'Which large reptile lives on the islands of Indonesia?',
        answer: 'Komodo dragon',
        imageAnswer: './images/animals/komodowaran.jpg',
        possibleAnswers: ['Steppe lizard', 'Komodo dragon', 'Capybara', 'Toad lizard'],
        bookmarked: true,
    },
    {
        id: 10,
        question:
            'Which animal is a marsupial that lives in Australia and hunts small animals?',
        answer: 'Marsupial marten',
        imageAnswer: './images/animals/beutelmarder.jpg',
        possibleAnswers: ['Quokka', 'Marsupial marten', 'Numbat', 'Kusu'],
        bookmarked: false,
    },
];

const nav = [
    {
        href: "index.html",
        ariaLabel: "Home",
        image: "icons/nav__quizhome.png",
        alt: "go to home"
    },
    {
        href: "bookmarks.html",
        ariaLabel: "Bookmarks",
        image: "icons/nav__bookmark.png",
        alt: "go to bookmarks"
    },
    {
        href: "createCard.html",
        ariaLabel: "Create new card",
        image: "icons/createCard.png",
        alt: "create new card"
    },
    {
        href: "profile.html",
        ariaLabel: "Profile",
        image: "icons/nav__profile.png",
        alt: "go to profile"
    }
];

