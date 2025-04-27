import { cards_ludzie_json } from '../images/cards/ludzie.js';
import { cards_zombiaki_json } from '../images/cards/zombiaki.js';
import { initMenu } from './menu.js';


const choose_ludzie = document.getElementById('choose-ludzie');
const choose_zombiaki = document.getElementById('choose-zombiaki');

const card_1_zombiaki = document.getElementById('card_1_zombiaki');
const card_2_zombiaki = document.getElementById('card_2_zombiaki');
const card_3_zombiaki = document.getElementById('card_3_zombiaki');
const card_4_zombiaki = document.getElementById('card_4_zombiaki');

const card_1_ludzie = document.getElementById('card_1_ludzie');
const card_2_ludzie = document.getElementById('card_2_ludzie');
const card_3_ludzie = document.getElementById('card_3_ludzie');
const card_4_ludzie = document.getElementById('card_4_ludzie');

const cards_zombiaki = [card_1_zombiaki, card_2_zombiaki, card_3_zombiaki, card_4_zombiaki];
const cards_ludzie = [card_1_ludzie, card_2_ludzie, card_3_ludzie, card_4_ludzie]

const chosen_card = document.getElementById('chosen_card');
const chosen_card_picture = document.getElementById('chosen_card_picture');
const close_card = document.getElementById('close_card');
const play_card = document.getElementById('play_card');
const throw_card = document.getElementById('throw_card');

choose_ludzie.addEventListener('click', () => start('ludzie'));
choose_zombiaki.addEventListener('click', () => start('zombiaki'));


// GLOBAL VARIABLES
let MAX_CARD_THROWN = 1;
let MAX_CARD_PLAYED = 3;
let cards_thrown = 0;
let cards_played = 0;
let active_card = null;
let deck_zombiaki = [];
let deck_ludzie = [];
let playable_cards = [];
let race = null;


function start(race_chosen) {
    race = race_chosen;
    // Stwórz talię
    createDeck();

    // Potasuj talię
    shuffle();

    // Wrzuć talię na ekran
    showDeck();

    // Obsługa talii

}

function createDeck() {
    deck_zombiaki = [];
    deck_ludzie = [];
    const deck_json_ludzie = cards_ludzie_json;
    const deck_json_zombiaki = cards_zombiaki_json;

    for (let i = 0; i < deck_json_ludzie.length; i++) {
        const { id, amount } = deck_json_ludzie[i];
        const image_src = `images/cards/ludzie/${id}.webp`;
        const card = { ...deck_json_ludzie[i], image_src };
        for (let j = 0; j < amount; j++) {
            deck_ludzie.push(card);
        }
    }
    for (let i = 0; i < deck_json_zombiaki.length; i++) {
        const { id, amount } = deck_json_zombiaki[i];
        const image_src = `images/cards/zombiaki/${id}.webp`;
        const card = { ...deck_json_zombiaki[i], image_src };
        for (let j = 0; j < amount; j++) {
            deck_zombiaki.push(card);
        }
    }


}

function shuffleDeck() {
    for (let i = deck_ludzie.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck_ludzie[i], deck_ludzie[j]] = [deck_ludzie[j], deck_ludzie[i]];
    }
    for (let i = deck_zombiaki.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck_zombiaki[i], deck_zombiaki[j]] = [deck_zombiaki[j], deck_zombiaki[i]];
    }
}

function shuffle() {
    for (let i = 0; i < 5; i++) {
        shuffleDeck();
    }

    const endCard = {
        id: 'dawn',
        amount: 1,
        name: "ŚWIT",
        image_src: `images/cards/zombiaki/dawn.webp`
    }

    deck_zombiaki.push(endCard);
}

function showDeck() {
    initMenu();
    firstDraw();
}


function firstDraw() {
    playable_cards = [];

    for (let i = 0; i < cards_zombiaki.length; i++) {
        const card = deck_zombiaki.shift();
        const { id, name } = card;
        cards_zombiaki[i].src = `images/cards/zombiaki/${id}.webp`;
        cards_zombiaki[i].dataset.id = id;
        cards_zombiaki[i].dataset.name = name;
        if (race === "zombiaki") playable_cards.push(card);
    }

    for (let i = 0; i < cards_ludzie.length; i++) {
        const card = deck_ludzie.shift();
        const { id, name } = card;
        cards_ludzie[i].src = `images/cards/ludzie/${id}.webp`;
        cards_ludzie[i].dataset.id = id;
        cards_ludzie[i].dataset.name = name;
        if (race === "ludzie") playable_cards.push(card);
    }
    setCards();
}
//ZAGRANIA KARTY

function setCards() {
    let player_cards = [];
    if (race === "zombiaki") player_cards = cards_zombiaki;
    if (race === "ludzie") player_cards = cards_ludzie;


    player_cards.forEach(card => {
        card.addEventListener('click', () => {
            console.log(card);
            chosen_card_picture.src = card.src;
            active_card = playable_cards.find(el => el.id === +card.getAttribute('data-id'));
            if (!active_card) {
                return;
            }
            chosen_card.classList.remove('hidden');
        })
    })

    close_card.addEventListener('click', () => {
        chosen_card.classList.add('hidden');
    })
    playCard();
    throwCard();
}


function playCard() {
    play_card.addEventListener('click', () => {
        if (cards_thrown === 0) {
            showAlert('NAJPIERW ODRZUĆ JEDNĄ KARTĘ');
            chosen_card.classList.add('hidden');
            return
        }

        if (cards_played >= MAX_CARD_PLAYED) {
            showAlert('NIE MOŻESZ ZAGRAĆ WIĘCEJ KART');
            chosen_card.classList.add('hidden');
            return
        }

        cards_played++;

        //ADD FUNCTION TO PLAY
        removeCard();
    })
}

function throwCard() {
    throw_card.addEventListener('click', () => {
        if (cards_thrown >= MAX_CARD_THROWN) {
            showAlert('JUŻ ODRZUCIŁEŚ KARTY');
            chosen_card.classList.add('hidden');
            return;
        }
        cards_thrown++;
        removeCard();
    })

}


function showAlert(text) {
    const alert = document.getElementById('alert');
    const close_alert = document.getElementById('close_alert');
    const alert_text = document.getElementById('alert_text');

    alert_text.innerText = text;
    alert.classList.remove('hidden');

    close_alert.addEventListener('click', () => {
        alert.classList.add('hidden');
    })
}

function removeCard() {
    const id = active_card.id;
    const indexRemove = playable_cards.findIndex(el => el.id === active_card.id);
    playable_cards.splice(indexRemove, 1);
    const cardToRemove = document.querySelector(`img[data-id="${id}"]`);
    cardToRemove.src = `images/cards/blank.webp`;
    cardToRemove.classList.add('card_blank');
    cardToRemove.dataset.id = null;
    cardToRemove.dataset.name = null;
    chosen_card.classList.add('hidden');
}