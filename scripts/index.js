import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';
import { initMenu, chooseRace } from './menu.js';
import { showAlert } from './utils.js';
import { placeCard, updateBoard, resetUsableCards, testMode } from './board.js';
import { show, hide, enable, disable } from './utils.js';

// const choose_ludzie = document.getElementById('choose-ludzie');
// const choose_zombiaki = document.getElementById('choose-zombiaki');
const start_button = document.getElementById('start');


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

export const chosen_card = document.getElementById('chosen_card');
export const chosen_card_picture = document.getElementById('chosen_card_picture');
export const close_card = document.getElementById('close_card');
export const play_card = document.getElementById('play_card');
export const throw_card = document.getElementById('throw_card');
const cancel_button = document.getElementById('cancel');

export const deck_json_ludzie = cards_ludzie_json;
export const deck_json_zombiaki = cards_zombiaki_json;

export const TEST_MODE = false;

// choose_ludzie.addEventListener('click', () => start('ludzie'));
// choose_zombiaki.addEventListener('click', () => start('zombiaki'));
start_button.addEventListener('click', () => start('zombiaki'));

// GLOBAL VARIABLES
let turn = 'zombiaki';
let prev_turn = null;

let MIN_CARD_THROWN = 1;
let bear_played = false;
let player_cards = [];
let cards_thrown = 0;
let cards_played = 0;
let active_card = null;
let deck_zombiaki = [];
let deck_ludzie = [];
let active_cards_ludzie = [];
let active_cards_zombiaki = [];
let playable_cards = [];
let game_over = false;



function start(race_chosen) {
    turn = race_chosen;
    prev_turn = 'ludzie';
    if (TEST_MODE) startTest('ludzie');
    startDeck();

    // Obsługa tur
    handleNewTurn();
}

function startDeck() {
    showBackground()
    createDeck()
    //shuffle();
    initMenu(turn);
    drawCards(true);
    playCard();
    throwCard();
}


function showBackground() {
    document.body.classList.add('background');
}
function startTest(race) {
    testMode();
    turn = race;
    prev_turn = race === 'ludzie' ? 'zombiaki' : 'ludzie';
}

function createDeck() {
    deck_zombiaki = [];
    deck_ludzie = [];

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


function getCardsFromDeck(first_draw, deck) {
    playable_cards = [];
    for (let i = 0; i < deck.length; i++) {
        let card = null;
        const currentId = deck[i].getAttribute('data-id');
        if (!first_draw && currentId && currentId !== 'blank') {
            if (turn === 'ludzie') {
                card = active_cards_ludzie.find(el => el.id === +currentId);
                playable_cards.push(card);
            }

            if (turn === 'zombiaki') {
                card = active_cards_zombiaki.find(el => el.id === +currentId);
                playable_cards.push(card);
            }
            continue;
        }

        if (turn === 'zombiaki') card = deck_zombiaki.shift();
        if (turn === 'ludzie') card = deck_ludzie.shift();
        if (card) {
            const { id, name } = card;
            if (card.name === 'ŚWIT') gameOver('ludzie');
            deck[i].src = `images/cards/${turn}/${id}.webp`;
            deck[i].dataset.id = id;
            deck[i].dataset.name = name;
            deck[i].classList.remove('card_blank');
            playable_cards.push(card);
            if (turn === 'ludzie') active_cards_ludzie.push(card);
            if (turn === 'zombiaki') active_cards_zombiaki.push(card);
        }
    }
}
export function gameOver(winner) {
    if (winner === 'ludzie') showAlert(`LUDZIE WYGRALI WSZYSTKIE ZOMBIAKI SĄ JESZCZE BARDZIEJ MARTWE`);
    if (winner === 'zombiaki') showAlert('ZOMBIAKI WYGRAŁY WSZYSCY LUDZIE DOŁĄCZYLI DO HORDY NIEUMARŁYCH');
    game_over = true;
}


function drawCards(first_draw = false) {

    if (turn === 'ludzie') getCardsFromDeck(first_draw, cards_ludzie);
    if (turn === 'zombiaki') getCardsFromDeck(first_draw, cards_zombiaki);
    if (first_draw) {
        const deck = document.getElementById(`deck_${prev_turn}`);
        disable(deck);
    }

    setCards();
}

//ZAGRANIA KARTY

function showCard(card) {
    return function () {
        chosen_card_picture.src = card.src;
        active_card = playable_cards.find(el => el.id === +card.getAttribute('data-id'));
        if (!active_card) {
            return;
        }
        show(chosen_card);
        close_card.addEventListener('click', () => {
            hide(chosen_card);
        }, { once: true });
    }
}
function setCards() {
    if (turn === "zombiaki") player_cards = cards_zombiaki;
    if (turn === "ludzie") player_cards = cards_ludzie;

    player_cards.forEach(card => {
        const handler = showCard(card);
        card.handler = handler;
        card.addEventListener('click', handler);
    });
}

function unsetCards() {
    player_cards.forEach(card => {
        card.removeEventListener('click', card.handler);
        card.handler = null;
    });
}

function playCard() {
    play_card.addEventListener('click', () => {
        if (cards_thrown < MIN_CARD_THROWN) {
            showAlert('NAJPIERW ODRZUĆ JEDNĄ KARTĘ');
            hide(chosen_card);
            return
        }
        cards_played++;

        placeCard(active_card);
        if (!active_card.board) {
            removeCard();
            return;
        }
        hide(chosen_card);
    })
}

function throwCard() {
    throw_card.addEventListener('click', () => {
        if (turn === 'zombiaki') {
            resetUsableCards();
        }
        cards_thrown++;
        if (cards_thrown >= MIN_CARD_THROWN) {
            show(play_card);
            hide(throw_card);
        }
        removeCard();

    })
}

export function removeCard() {
    if (!active_card) return;
    const id = active_card.id;
    indexRemove(playable_cards);
    if (turn === 'ludzie') indexRemove(active_cards_ludzie);
    if (turn === 'zombiaki') indexRemove(active_cards_zombiaki);
    const card_to_remove = document.querySelector(`img[data-id="${id}"][data-playable="true"]`);
    if (card_to_remove) {
        card_to_remove.src = `images/cards/${turn}/rewers.webp`;
        card_to_remove.classList.add('card_blank');
        card_to_remove.dataset.id = 'blank';
        card_to_remove.dataset.name = 'blank';
        card_to_remove.removeEventListener('click', card_to_remove.handler);
    }
    hide(chosen_card);
    hide(cancel_button);
}

function indexRemove(array) {
    const index_remove = array.findIndex(el => el.id === active_card.id);
    array.splice(index_remove, 1);
}

function handleNewTurn() {
    const ludzie_end_turn = document.getElementById('rewers_stack_ludzie');
    const zombiaki_end_turn = document.getElementById('rewers_stack_zombiaki');
    const end_turn_cards = [ludzie_end_turn, zombiaki_end_turn];
    end_turn_cards.forEach(el => {
        el.addEventListener('click', () => {
            endTurn();
        })
    })
    hide(play_card);
    show(throw_card);
}

function endTurn() {
    if (cards_thrown < MIN_CARD_THROWN) {
        showAlert("MUSISZ ODRZUCIĆ KARTĘ");
        return;
    }

    MIN_CARD_THROWN = 1;
    cards_thrown = 0;
    cards_played = 0;
    active_card = null;
    switchTurn();
    unsetCards();
    drawCards();
}

function switchTurn() {
    let deck = document.getElementById(`deck_${turn}`);
    disable(deck);
    [prev_turn, turn] = [turn, prev_turn];
    cards_thrown = 0;
    chooseRace(turn);
    updateBoard(prev_turn);
    hide(play_card);
    show(throw_card);
    deck = document.getElementById(`deck_${turn}`);
    enable(deck)
    if (bear_played) MIN_CARD_THROWN = 2;
    bear_played = false;

}

export function setBearPlayed(value) {
    bear_played = value;
}

export function setActiveCard(card) {
    active_card = card;
}

export function checkTurn() {
    return turn;
}

document.addEventListener('dblclick', function (e) {
    e.preventDefault();
    return false;
}, false);

document.addEventListener('mousedown', () => {
    document.body.classList.add('clicking');
});

document.addEventListener('mouseup', () => {
    document.body.classList.remove('clicking');
});