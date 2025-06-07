import { cards_humans_json } from './humans/cards.js';
import { cards_zombies_json } from './zombies/cards.js';
import { initMenu, chooseRace, } from './menu.js';
import { addListener, randomRotate, removeListener, showAlert } from './utils.js';
import { placeCard, updateBoard, resetUsableCards, board, addInstruction } from './board.js';
import { show, hide, enable, disable } from './utils.js';
import { testMode, get_test_deck_humans, get_test_deck_zombies, TEST_MODE, TEST_STATE } from './test.js';

// const choose_humans = document.getElementById('choose-humans');
// const choose_zombies = document.getElementById('choose-zombies');
const start_button = document.getElementById('start');


const card_1_zombies = document.getElementById('card_1_zombies');
const card_2_zombies = document.getElementById('card_2_zombies');
const card_3_zombies = document.getElementById('card_3_zombies');
const card_4_zombies = document.getElementById('card_4_zombies');

const card_1_humans = document.getElementById('card_1_humans');
const card_2_humans = document.getElementById('card_2_humans');
const card_3_humans = document.getElementById('card_3_humans');
const card_4_humans = document.getElementById('card_4_humans');

export const cards_zombies = [card_1_zombies, card_2_zombies, card_3_zombies, card_4_zombies];
export const cards_humans = [card_1_humans, card_2_humans, card_3_humans, card_4_humans]

export const chosen_card = document.getElementById('chosen_card');
export const chosen_card_picture = document.getElementById('chosen_card_picture');
export const close_card = document.getElementById('close_card');
export const play_card = document.getElementById('play_card');
export const throw_card = document.getElementById('throw_card');
export const deck_humans_element = document.getElementById('deck_humans');
export const deck_zombies_element = document.getElementById('deck_zombies');
export const cancel_button = document.getElementById('cancel');
const reset_button = document.getElementById('reset');

export const deck_json_humans = cards_humans_json;
export const deck_json_zombies = cards_zombies_json;

// choose_humans.addEventListener('click', () => start('humans'));
// choose_zombies.addEventListener('click', () => start('zombies'));
start_button.addEventListener('click', () => start('zombies'));

// GLOBAL VARIABLES
let turn = 'zombies';
let prev_turn = null;

let MIN_CARD_THROWN = 1;
let MAX_CARD_PLAYED = 4;
let bear_played = false;
let player_cards = [];
let cards_thrown = 0;
let cards_played = 0;
let is_terror = false;
let active_card = null;
let deck_zombies = [];
let deck_humans = [];
let active_cards_humans = [];
let active_cards_zombies = [];
let playable_cards = [];
let game_over = false;



function start(race_chosen) {
    turn = race_chosen;
    prev_turn = 'humans';
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
    prev_turn = race === 'humans' ? 'zombies' : 'humans';
}

function createDeck() {
    deck_zombies = [];
    deck_humans = [];


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
        const test_deck_zombies = get_test_deck_zombies();
        const test_deck_humans = get_test_deck_humans();
        processDeck(test_deck_humans, deck_humans, 'humans');
        processDeck(test_deck_zombies, deck_zombies, 'zombies');
        return;
    }
    processDeck(deck_json_humans, deck_humans, 'humans');
    processDeck(deck_json_zombies, deck_zombies, 'zombies');
}

function shuffleDeck() {
    for (let i = deck_humans.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck_humans[i], deck_humans[j]] = [deck_humans[j], deck_humans[i]];
    }
    for (let i = deck_zombies.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck_zombies[i], deck_zombies[j]] = [deck_zombies[j], deck_zombies[i]];
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
        image_src: `images/cards/zombies/dawn.webp`
    }

    deck_zombies.push(endCard);
}


function getCardsFromDeck(first_draw, deck) {
    playable_cards = [];
    for (let i = 0; i < deck.length; i++) {
        let card = null;
        const currentId = deck[i].getAttribute('data-id');
        if (!first_draw && currentId && currentId !== 'blank') {
            if (turn === 'humans') {
                card = active_cards_humans.find(el => el.id === +currentId);
                playable_cards.push(card);
            }

            if (turn === 'zombies') {
                card = active_cards_zombies.find(el => el.id === +currentId);
                playable_cards.push(card);
            }
            continue;
        }

        if (turn === 'zombies') card = deck_zombies.shift();
        if (turn === 'humans') card = deck_humans.shift();
        if (card) {
            const { id, name } = card;
            if (card.name === 'ŚWIT') gameOver('humans');
            randomRotate(10, deck[i]);
            deck[i].src = `images/cards/${turn}/${id}.webp`;
            deck[i].dataset.id = id;
            deck[i].dataset.name = name;
            deck[i].classList.remove('card_blank');
            playable_cards.push(card);
            if (turn === 'humans') active_cards_humans.push(card);
            if (turn === 'zombies') active_cards_zombies.push(card);
        }
    }
    if (turn === 'zombies') setDawnStyle(deck_zombies.length);
}
export function gameOver(winner) {
    if (winner === 'humans') showAlert(`LUDZIE WYGRALI WSZYSTKIE zombies SĄ JESZCZE BARDZIEJ MARTWE`, { game_over: true });
    if (winner === 'zombies') showAlert('zombies WYGRAŁY WSZYSCY LUDZIE DOŁĄCZYLI DO HORDY NIEUMARŁYCH', { game_over: true });
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

    if (turn === 'humans') getCardsFromDeck(first_draw, cards_humans);
    if (turn === 'zombies') getCardsFromDeck(first_draw, cards_zombies);
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
    if (turn === 'zombies' && active_card.name === 'KLIK') disable(play_card);
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
    if (turn === "zombies") player_cards = cards_zombies;
    if (turn === "humans") player_cards = cards_humans;
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
    if (turn === 'humans') indexRemove(active_cards_humans);
    if (turn === 'zombies') indexRemove(active_cards_zombies);
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

export function removeCardzombies(id) {
    const index_remove = active_cards_zombies.findIndex(el => el.id === active_card.id);
    active_cards_zombies.splice(index_remove, 1);
}

function handleFirstTurn() {
    const humans_end_turn = document.getElementById('rewers_stack_humans');
    const zombies_end_turn = document.getElementById('rewers_stack_zombies');
    const end_turn_cards = [humans_end_turn, zombies_end_turn];
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

    if (turn === 'humans') checkForBearAndTerror();
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
    if (turn === 'humans') return;
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

export function getActiveCardszombies() {
    return active_cards_zombies;
}

export function getDeckzombies() {
    return deck_zombies;
}

export function setDeckzombies(array) {
    deck_zombies = array;
}

export function getActiveCardsLudzie() {
    return active_cards_humans;
}

export function setActiveCardsLudzie(array) {
    active_cards_humans = array;
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