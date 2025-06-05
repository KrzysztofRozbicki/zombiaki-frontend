import { cards_ludzie_json } from './ludzie/cards.js';
import { cards_zombiaki_json } from './zombiaki/cards.js';
import { initMenu, chooseRace, } from './menu.js';
import { addListener, randomRotate, removeListener, showAlert } from './utils.js';
import { placeCard, updateBoard, resetUsableCards, board, addInstruction } from './board.js';
import { show, hide, enable, disable } from './utils.js';
import { testMode, get_test_deck_ludzie, get_test_deck_zombiaki, TEST_MODE, TEST_STATE } from './test.js';

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
export const deck_ludzie_element = document.getElementById('deck_ludzie');
export const deck_zombiaki_element = document.getElementById('deck_zombiaki');
export const cancel_button = document.getElementById('cancel');
const reset_button = document.getElementById('reset');

export const deck_json_ludzie = cards_ludzie_json;
export const deck_json_zombiaki = cards_zombiaki_json;

// choose_ludzie.addEventListener('click', () => start('ludzie'));
// choose_zombiaki.addEventListener('click', () => start('zombiaki'));
start_button.addEventListener('click', () => start('zombiaki'));

// GLOBAL VARIABLES
let turn = 'zombiaki';
let prev_turn = null;

let MIN_CARD_THROWN = 1;
let MAX_CARD_PLAYED = 4;
let bear_played = false;
let player_cards = [];
let cards_thrown = 0;
let cards_played = 0;
let is_terror = false;
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
    if (TEST_STATE) startTest(TEST_MODE.race);
    startDeck();
    handleFirstTurn();
}

function startDeck() {
    createDeck()
    if (!TEST_STATE) shuffle();
    initMenu(turn);
    drawCards(true);
    addListener(play_card, playCardHandler())
    addListener(throw_card, throwCardHandler());
}



function startTest(race) {
    testMode();
    turn = race;
    prev_turn = race === 'ludzie' ? 'zombiaki' : 'ludzie';
}

function createDeck() {
    deck_zombiaki = [];
    deck_ludzie = [];


    function processDeck(source_deck, target_deck, race) {
        for (let i = 0; i < source_deck.length; i++) {
            const { id, amount } = source_deck[i];
            const image_src = `images/cards/${race}/${id}.webp`;
            const card = { ...source_deck[i], image_src };
            if (TEST_MODE) {
                target_deck.push(card);
                continue;
            }
            for (let j = 0; j < amount; j++) {
                target_deck.push(card);
            }
        }
    }

    if (TEST_MODE) {
        const test_deck_zombiaki = get_test_deck_zombiaki();
        const test_deck_ludzie = get_test_deck_ludzie();
        processDeck(test_deck_ludzie, deck_ludzie, 'ludzie');
        processDeck(test_deck_zombiaki, deck_zombiaki, 'zombiaki');
        return;
    }
    processDeck(deck_json_ludzie, deck_ludzie, 'ludzie');
    processDeck(deck_json_zombiaki, deck_zombiaki, 'zombiaki');
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
            randomRotate(10, deck[i]);
            deck[i].src = `images/cards/${turn}/${id}.webp`;
            deck[i].dataset.id = id;
            deck[i].dataset.name = name;
            deck[i].classList.remove('card_blank');
            playable_cards.push(card);
            if (turn === 'ludzie') active_cards_ludzie.push(card);
            if (turn === 'zombiaki') active_cards_zombiaki.push(card);
        }
    }
    if (turn === 'zombiaki') setDawnStyle(deck_zombiaki.length);
}
export function gameOver(winner) {
    if (winner === 'ludzie') showAlert(`LUDZIE WYGRALI WSZYSTKIE ZOMBIAKI SĄ JESZCZE BARDZIEJ MARTWE`, { game_over: true });
    if (winner === 'zombiaki') showAlert('ZOMBIAKI WYGRAŁY WSZYSCY LUDZIE DOŁĄCZYLI DO HORDY NIEUMARŁYCH', { game_over: true });
}

function setDawnStyle(length) {
    const main = document.querySelector('main');
    const all_cards = 31;
    const start_brightness = 0.5;
    const end_brightness = 2;
    const start_sepia = 0.7;
    const end_sepia = 0;
    const brigthness_range = end_brightness - start_brightness;
    const sepia_range = end_sepia - start_sepia;
    const progress_percentage = 1 - (length / all_cards).toFixed(2);
    const brightness_value = start_brightness + (progress_percentage * brigthness_range);
    const sepia_value = start_sepia + (progress_percentage * sepia_range)

    main.style.backdropFilter = `brightness(${brightness_value}) sepia(${sepia_value})`;
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

function showCardHandler(card) {
    return function () {
        showCard(card);
    }
}

export function showCard(card, is_bucket = false) {
    chosen_card_picture.src = card.src;
    active_card = playable_cards.find(el => el.id === +card.getAttribute('data-id'));
    const button_box = chosen_card.querySelector('.card_buttons_box');
    show(button_box);

    if (!active_card) return;
    if (turn === 'zombiaki' && active_card.name === 'KLIK') disable(play_card);
    const card_element = document.querySelector('#chosen_card > div');
    addInstruction(card_element, active_card);
    show(chosen_card);
    if (is_bucket) return;
    addListener(close_card, closeCardHandler(), { once: true })
    if (play_card.innerText !== 'ZAGRAJ') play_card.innerText = 'ZAGRAJ';

}

export function closeCardHandler() {
    return function () {
        enable(play_card);
        hide(chosen_card);
        removeListener(close_card);
        const instruction_element = document.querySelector('#chosen_card .instruction_element');
        if (instruction_element) instruction_element.remove();
    }
}


function setCards() {
    if (turn === "zombiaki") player_cards = cards_zombiaki;
    if (turn === "ludzie") player_cards = cards_ludzie;
    player_cards.forEach(card => addListener(card, showCardHandler(card)));
}

function unsetCards() {
    player_cards.forEach(card => removeListener(card));
}

function playCardHandler() {
    return function () {
        if (cards_thrown < MIN_CARD_THROWN) {
            showAlert('NAJPIERW ODRZUĆ JEDNĄ KARTĘ');
            hide(chosen_card);
            return
        }
        hide(chosen_card);
        placeCard(active_card);
        removeListener(close_card);
        if (!active_card?.board) {
            removeCard();
            return;
        }
    }
}

function throwCardHandler() {
    return function () {
        cards_thrown++;
        if (cards_thrown >= MIN_CARD_THROWN) {
            resetUsableCards();
            show(play_card);
            enable(play_card);
            hide(throw_card);
        }
        removeCard();
    }
}

export function removeCard() {
    removeListener(close_card);
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
        removeListener(card_to_remove);
    }
    const all_fields = document.querySelectorAll('.field');
    all_fields.forEach(field => enable(field));
    hide(chosen_card);
    hide(cancel_button);
    active_card = null;
    cards_played++;
    if (cards_played > MAX_CARD_PLAYED) {
        MAX_CARD_PLAYED = 4;
        setTimeout(() => endTurn(), 100);
    }
    const instruction_element = document.querySelector('#chosen_card .instruction_element');
    if (instruction_element) instruction_element.remove();
}

export function indexRemove(array) {
    const index_remove = array.findIndex(el => el.id === active_card.id);
    array.splice(index_remove, 1);
}

export function removeCardZombiaki(id) {
    const index_remove = active_cards_zombiaki.findIndex(el => el.id === active_card.id);
    active_cards_zombiaki.splice(index_remove, 1);
}

function handleFirstTurn() {
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
    checkBucket();
}

function endTurn() {
    if (cards_thrown < MIN_CARD_THROWN && playable_cards.length > 0) {
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
    enable(deck);

    if (turn === 'ludzie') checkForBearAndTerror();
}

function checkForBearAndTerror() {
    const had_bear = bear_played
    const had_terror = is_terror;
    if (is_terror) {
        MAX_CARD_PLAYED = 1;
        if (bear_played) MAX_CARD_PLAYED = 2;
        is_terror = false;
        showAlert('ZAPANOWAŁ TERROR! MOŻESZ ZAGRAĆ TYLKO JEDNĄ KARTĘ!');
    }

    if (bear_played) {
        MIN_CARD_THROWN = 2;
        bear_played = false;
        showAlert('WIELKI MIŚ ZUŻYWA TWOJE ZASOBY! MUSISZ ODRZUCIĆ DWIE KARTY!');
    }

    if (had_bear && had_terror) {
        showAlert('WIELKI MIŚ ZUŻYWA TWOJE ZASOBY! MUSISZ ODRZUCIĆ DWIE KARTY! PONADTO ZAPANOWAŁ TERROR! MOŻESZ ZAGRAĆ TYLKO JEDNĄ KARTĘ!')
    }
}

export function checkBucket() {
    if (turn === 'ludzie') return;
    const bucket_card = player_cards.find(card => card.getAttribute('data-name') === 'WIADRO');
    if (!bucket_card) return;
    showCard(bucket_card, { is_bucket: true });
    hide(throw_card);
    show(play_card);
    hide(close_card);
    MIN_CARD_THROWN = 0;
}
export function setBearPlayed(value) {
    bear_played = value;
}

export function setActiveCard(card) {
    active_card = card;
}

export function getTurn() {
    return turn;
}

export function getActiveCardsZombiaki() {
    return active_cards_zombiaki;
}

export function getDeckZombiaki() {
    return deck_zombiaki;
}

export function setDeckZombiaki(array) {
    deck_zombiaki = array;
}

export function getActiveCardsLudzie() {
    return active_cards_ludzie;
}

export function setActiveCardsLudzie(array) {
    active_cards_ludzie = array;
}

export function setTerror(boolean) {
    is_terror = boolean;
}
export function getTerror() {
    return is_terror;
}

export function setMinCardsThrown(number) {
    MIN_CARD_THROWN = number;
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

reset_button.addEventListener('click', () => {
    window.location.reload();
})