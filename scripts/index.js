import { cards_ludzie_json } from '../images/cards/ludzie.js';
import { cards_zombiaki_json } from '../images/cards/zombiaki.js';
import { initMenu, chooseRace } from './menu.js';
import { showAlert } from './utils.js';
import { placeCard, updateBoard } from './board.js';
import { show, hide } from './utils.js';

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

// choose_ludzie.addEventListener('click', () => start('ludzie'));
// choose_zombiaki.addEventListener('click', () => start('zombiaki'));
start_button.addEventListener('click', () => start('zombiaki'));



// GLOBAL VARIABLES
export let turn = 'zombiaki';
export let prev_turn = null;

let player_cards = [];
let MAX_CARD_THROWN = 1;
let MAX_CARD_PLAYED = 3;
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
    startDeck();


    // Obsługa tur
    handleNewTurn();
}

function startDeck() {
    createDeck()
    //shuffle();
    initMenu(turn);
    drawCards(true);
    playCard();
    throwCard();
    prev_turn = 'ludzie';
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
    console.log(playable_cards);
}
export function gameOver(winner) {
    if (winner === 'ludzie') showAlert(`LUDZIE WYGRALI WSZYSTKIE ZOMBIAKI SĄ JESZCZE BARDZIEJ MARTWE`);
    if (winner === 'zombiaki') showAlert('ZOMBIAKI WYGRAŁY WSZYSCY LUDZIE DOŁĄCZYLI DO HORDY NIEUMARŁYCH');
    game_over = true;
}


function drawCards(first_draw = false) {

    if (turn === 'ludzie') getCardsFromDeck(first_draw, cards_ludzie);
    if (turn === 'zombiaki') getCardsFromDeck(first_draw, cards_zombiaki);

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

    close_card.addEventListener('click', () => {
        hide(chosen_card);
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
        if (cards_thrown === 0) {
            showAlert('NAJPIERW ODRZUĆ JEDNĄ KARTĘ');
            hide(chosen_card);
            return
        }

        if (cards_played >= MAX_CARD_PLAYED) {
            showAlert('NIE MOŻESZ ZAGRAĆ WIĘCEJ KART');
            hide(chosen_card);
            return
        }

        cards_played++;

        //ADD FUNCTION TO PLAY
        placeCard(active_card);
        removeCard();
    })
}

function throwCard() {
    throw_card.addEventListener('click', () => {
        if (cards_thrown >= MAX_CARD_THROWN) {
            showAlert('JUŻ ODRZUCIŁEŚ KARTY');
            hide(chosen_card);
            return;
        }
        cards_thrown++;
        show(play_card);
        hide(throw_card);
        removeCard();
    })
}

function removeCard() {
    const id = active_card.id;
    indexRemove(playable_cards);
    if (turn === 'ludzie') indexRemove(active_cards_ludzie);
    if (turn === 'zombiaki') indexRemove(active_cards_zombiaki);
    const card_to_remove = document.querySelector(`img[data-id="${id}"][data-playable="true"]`);
    card_to_remove.src = `images/cards/${turn}/rewers.webp`;
    card_to_remove.classList.add('card_blank');
    card_to_remove.dataset.id = 'blank';
    card_to_remove.dataset.name = 'blank';
    card_to_remove.removeEventListener('click', card_to_remove.handler);
    hide(chosen_card);
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

    if (cards_thrown === 0) {
        showAlert("MUSISZ ODRZUCIĆ KARTĘ");
        return;
    }

    cards_thrown = 0;
    cards_played = 0;
    active_card = null;

    switchTurn();
    unsetCards();
    drawCards();
}

function switchTurn() {
    [prev_turn, turn] = [turn, prev_turn];
    chooseRace(turn);
    updateBoard(prev_turn);
    hide(play_card);
    show(throw_card);
}