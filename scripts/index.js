import { cards_ludzie } from '../images/cards/ludzie.js';
import { cards_zombiaki } from '../images/cards/zombiaki.js';
import { initMenu } from './menu.js';

const choose_race = document.getElementById('choose-race');
const choose_ludzie = document.getElementById('choose-ludzie');
const choose_zombie = document.getElementById('choose-zombiaki');

const menu_element = document.getElementById('menu');

const deck_element = document.getElementById('deck');
const current_card = document.getElementById('current_card');
const board_element = document.getElementById('board');

choose_ludzie.addEventListener('click', () => start('ludzie'));
choose_zombie.addEventListener('click', () => start('zombiaki'));

let deck = [];
function start(race) {
    // Stwórz talię
    createDeck(race);

    // Potasuj talię
    shuffle(race);

    // Wrzuć talię na ekran
    showDeck(race);

    // Obsługa talii
    startDeck(race);
}

function createDeck(race) {
    deck = [];
    let deck_json = null;
    if (race === 'ludzie') deck_json = cards_ludzie;
    if (race === 'zombiaki') deck_json = cards_zombiaki;

    for (let i = 0; i < deck_json.length; i++) {
        const { id, amount } = deck_json[i];
        const image_src = `images/cards/${race}/${id}.webp`;
        const card = { ...deck_json[i], image_src };
        for (let j = 0; j < amount; j++) {
            deck.push(card);
        }
    }


}

function shuffleDeck() {
    for (let i = deck.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function shuffle(race) {
    for (let i = 0; i < 5; i++) {
        shuffleDeck();
    }

    const endCard = {
        id: 'dawn',
        amount: 1,
        name: "ŚWIT",
        image_src: `images/cards/zombiaki/dawn.webp`
    }

    if (race === "zombiaki") {
        deck.push(endCard);
    }
}

function showDeck(race) {
    choose_race.classList.add('hidden');
    board_element.classList.remove('hidden');
    menu_element.classList.remove('hidden');

    current_card.src = `images/cards/${race}/rewers.webp`;
    initMenu();
}

function startDeck(race) {
    deck_element.addEventListener('click', () => {
        console.log('click');
        const card = deck.shift();
        console.log(card);
        const { id } = card;
        current_card.src = `images/cards/${race}/${id}.webp`
    })
}