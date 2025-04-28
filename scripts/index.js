import { cards_ludzie_json } from '../images/cards/ludzie.js';
import { cards_zombiaki_json } from '../images/cards/zombiaki.js';
import { initMenu } from './menu.js';
import { showAlert } from './utils.js';


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

export const cards_zombiaki = [card_1_zombiaki, card_2_zombiaki, card_3_zombiaki, card_4_zombiaki];
export const cards_ludzie = [card_1_ludzie, card_2_ludzie, card_3_ludzie, card_4_ludzie]

const chosen_card = document.getElementById('chosen_card');
const chosen_card_picture = document.getElementById('chosen_card_picture');
const close_card = document.getElementById('close_card');
const play_card = document.getElementById('play_card');
const throw_card = document.getElementById('throw_card');

choose_ludzie.addEventListener('click', () => start('ludzie'));
choose_zombiaki.addEventListener('click', () => start('zombiaki'));


// GLOBAL VARIABLES
let player_cards = [];
let MAX_CARD_THROWN = 1;
let MAX_CARD_PLAYED = 3;
let cards_thrown = 0;
let cards_played = 0;
let active_card = null;
let deck_zombiaki = [];
let deck_ludzie = [];
let playable_cards = [];
let race = null;
let game_over = false;
let winner = null;


function start(race_chosen) {
    race = race_chosen;
    startDeck();

    // Obsługa tur
    handleNewTurn();
}

function startDeck() {
    createDeck()
    shuffle();
    initMenu(race);
    drawCards(true);
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


function getCardsFromDeck(first_draw, deck, side) {

    for (let i = 0; i < deck.length; i++) {
        const currentId = deck[i].getAttribute('data-id');
        if (!first_draw) {
            if (currentId == true || currentId !== 'blank') continue;
        }
        let card = null;
        if (side === 'zombiaki') card = deck_zombiaki.shift();
        if (side === 'ludzie') card = deck_ludzie.shift();
        if (card) {
            const { id, name } = card;
            if (name === "ŚWIT") { game_over = true, winner = 'ludzie' };
            deck[i].src = `images/cards/${side}/${id}.webp`;
            deck[i].dataset.id = id;
            deck[i].dataset.name = name;
            if (race === side) playable_cards.push(card);
        }
    }
}

function drawCards(first_draw = false) {

    getCardsFromDeck(first_draw, cards_zombiaki, "zombiaki");
    getCardsFromDeck(first_draw, cards_ludzie, "ludzie");

    setCards(first_draw);
}

//ZAGRANIA KARTY

function handleCardEvent(card) {
    return function () {
        chosen_card_picture.src = card.src;
        active_card = playable_cards.find(el => el.id === +card.getAttribute('data-id'));
        if (!active_card) {
            return;
        }
        chosen_card.classList.remove('hidden');
    }
}
function setCards(first_draw) {
    if (race === "zombiaki") player_cards = cards_zombiaki;
    if (race === "ludzie") player_cards = cards_ludzie;

    player_cards.forEach(card => {
        const handler = handleCardEvent(card);
        card.handler = handler;
        card.addEventListener('click', handler);
    });

    close_card.addEventListener('click', () => {
        chosen_card.classList.add('hidden');
    });

    if (first_draw) {
        playCard();
        throwCard();
    }
}

function unsetCards() {
    player_cards.forEach(card => {
        card.removeEventListener('click', card.handler);
    });
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



function removeCard() {
    const id = active_card.id;
    const index_remove = playable_cards.findIndex(el => el.id === active_card.id);
    playable_cards.splice(index_remove, 1);
    const card_to_remove = document.querySelector(`img[data-id="${id}"][data-playable="true"]`);
    card_to_remove.src = `images/cards/blank.webp`;
    card_to_remove.classList.add('card_blank');
    card_to_remove.dataset.id = 'blank';
    card_to_remove.dataset.name = 'blank';
    card_to_remove.removeEventListener('click', card_to_remove.handler);
    chosen_card.classList.add('hidden');
}

function handleNewTurn() {
    const ludzie_end_turn = document.getElementById('rewers_stack_ludzie');
    const zombiaki_end_turn = document.getElementById('rewers_stack_zombiaki');
    const end_turn_cards = [ludzie_end_turn, zombiaki_end_turn];
    end_turn_cards.forEach(el => {
        el.addEventListener('click', () => {
            newTurn();
        })
    })
}

function newTurn() {

    if (cards_thrown === 0) {
        showAlert("MUSISZ ODRZUCIĆ KARTĘ");
        return;
    }

    cards_thrown = 0;
    cards_played = 0;
    active_card = null;

    //Dociągnięcie nowych kart
    unsetCards();
    drawCards();
}
