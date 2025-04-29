import { raceFunctions } from "./allCards.js";
import { gameOver } from "./index.js";
import { addBear } from "./zombiaki/id_1.js";

const T1_P5 = document.querySelector('div[data-tor="1"][data-przecznica="5"]');
const T2_P5 = document.querySelector('div[data-tor="2"][data-przecznica="5"]');
const T3_P5 = document.querySelector('div[data-tor="3"][data-przecznica="5"]');
const T1_P4 = document.querySelector('div[data-tor="1"][data-przecznica="4"]');
const T2_P4 = document.querySelector('div[data-tor="2"][data-przecznica="4"]');
const T3_P4 = document.querySelector('div[data-tor="3"][data-przecznica="4"]');
const T1_P3 = document.querySelector('div[data-tor="1"][data-przecznica="3"]');
const T2_P3 = document.querySelector('div[data-tor="2"][data-przecznica="3"]');
const T3_P3 = document.querySelector('div[data-tor="3"][data-przecznica="3"]');
const T1_P2 = document.querySelector('div[data-tor="1"][data-przecznica="2"]');
const T2_P2 = document.querySelector('div[data-tor="2"][data-przecznica="2"]');
const T3_P2 = document.querySelector('div[data-tor="3"][data-przecznica="2"]');
const T1_P1 = document.querySelector('div[data-tor="1"][data-przecznica="1"]');
const T2_P1 = document.querySelector('div[data-tor="2"][data-przecznica="1"]');
const T3_P1 = document.querySelector('div[data-tor="3"][data-przecznica="1"]');

let active_field = null;

let move_available = true;

export const board = [
    [{ element: T1_P5 }, { element: T2_P5 }, { element: T3_P5 }],
    [{ element: T1_P4 }, { element: T2_P4 }, { element: T3_P4 }],
    [{ element: T1_P3 }, { element: T2_P3 }, { element: T3_P3 }],
    [{ element: T1_P2 }, { element: T2_P2 }, { element: T3_P2 }],
    [{ element: T1_P1 }, { element: T2_P1 }, { element: T3_P1 }],
];


export function placeCard(card) {
    cardFunction(card);
}

export function putZombiak(card) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    zombiaki_deck.classList.add('disable');
    for (let i = 0; i < board[0].length; i++) {
        if (board[0][i].card) continue;
        putCard(board[0][i], card);
    }
}

export function updateBoard(prev_turn) {
    if (prev_turn === 'ludzie') moveZombiaki();
    if (prev_turn === 'zombiaki') moveLudzie();
    console.log(board);
}


function moveZombiaki() {
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const card = board[i][j].card;
            if (!card) continue;
            if (card.type === "zombiak" && !card.special) {
                //SPRAWDZENIE ZWYCIĘSTWA 
                if (i === 4) {
                    gameOver('zombiaki');
                    return;
                }
                //JEŚLI MUR TO NIE IDZIE DALEJ CHYBA ŻE SUMA WIĘCEJ
                //funkcja sprawdzająca mur i sume zombiaków
                //Czy mogą się ruszać
                //zmiana zombiaka o 1 pole do przodu
                const overlay = board[i][j].element.getAttribute('data-overlay');

                unsetField(board[i][j]);
                putPicture(board[i + 1][j], card);
                if (overlay) {
                    const card_overlay = board[i][j].card_overlay;
                    board[i][j].card_overlay = null;
                    if (overlay === 'MIŚ') addBear(card_overlay, board[i + 1][j]);
                }

                //sprawdzenie czy zombiak nie wszedł na minę / beczkę
            }
        }
    }
    move_available = true;
}


function moveLudzie() {
    console.log('ludzie idą do przodu');
}

function putCard(field, card) {
    const { element } = field;
    element.classList.add('field_available', `${card.race}`);
    const handler = setField(field, card);
    element.handler = handler;
    element.addEventListener('click', handler);
}

function unsetField(board_field) {
    const field = board_field.element;
    field.innerHTML = ``
    field.dataset.id = null;
    field.dataset.name = null;
    field.dataset.type = null;
    field.dataset.overlay = null;
    board_field.card = null;
}

function setField(field, card) {
    return function () {
        putPicture(field, card);
        board.forEach(przecznica => {
            przecznica.forEach(pole => {
                const { element } = pole;
                element.classList.remove(`${card.race}`, 'field_available');
                if (element.handler) {
                    element.removeEventListener('click', element.handler);
                    element.handler = null;
                }
            })
        })
        const zombiaki_deck = document.getElementById('deck_zombiaki');
        zombiaki_deck.classList.remove('disable');
    }
}

function putPicture(field, card) {
    const { id, name, race, type } = card;
    const { element } = field;
    element.innerHTML = `<img src='images/cards/${race}/${id}.webp' alt='card'/>`;
    element.dataset.id = id;
    element.dataset.name = name;
    element.dataset.type = type;
    field.card = card;
}

function cardFunction(card) {
    const { id, race } = card;
    const functionName = `${race}_id_${id}`;
    raceFunctions[functionName](card, active_field);
}