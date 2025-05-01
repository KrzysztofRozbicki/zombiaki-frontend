import { raceFunctions } from "./allCards.js";
import { gameOver } from "./index.js";
import { addOverlay } from "./zombiaki/utils.js";

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
let move_zombiaki = true;

const test_card = {
    "id": 3,
    "amount": 1,
    "name": "WACEK",
    "type": "zombiak",
    "description": "Na początku twojej tury Zombiak przesuwa się o 1 pole do przodu.",
    "flavor": "Taki sobie, na trzy plus.",
    "hp": 3,
    "max_hp": 3,
    "race": "zombiaki"
};

const test_overlay_card = {
    "id": 1,
    "amount": 1,
    "name": "MIŚ",
    "type": "overlay",
    "overlay_text": "ZAGRAJ MISIA",
    "description": "Połóż Misia na wybranego Zombiaka (z wyjątkiem Psa i Kota). Miś porusza się razem z Zombiakiem. W twojej turze możesz zmniejszyć siłę Misia o 1, aby grający ludźmi odrzucił 2 karty, a nie 1 w najbliższej fazie Odrzucenia. Miś może być atakowany tak jak Zombiak. Grający ludźmi może atakować Zombiaka lub Misia - jeśli Miś otrzyma więcej ran niż ma aktualnie siły, to pozostałe rany otrzymuje Zombiak. Jeśli Zombiak zginie, to Miś ginie razem z nim.",
    "flavor": "Misio chce zombiaczka.",
    "hp": 4,
    "max_hp": 4,
    "special": true,
    "race": "zombiaki"

}

export const board = [
    [{ element: T1_P5 }, { element: T2_P5 }, { element: T3_P5 }],
    [{ element: T1_P4 }, { element: T2_P4 }, { element: T3_P4 }],
    [{ element: T1_P3 }, { element: T2_P3 }, { element: T3_P3 }],
    [{ element: T1_P2 }, { element: T2_P2 }, { element: T3_P2 }],
    [{ element: T1_P1 }, { element: T2_P1 }, { element: T3_P1 }],
];


export function testMode() {
    const { id, race } = test_overlay_card
    setField(board[1][1], test_card);
    addOverlay(test_overlay_card, board[1][1], raceFunctions[`${race}_id_${id}_callback`])
}

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
    if (prev_turn === 'ludzie') {
        moveZombiaki();

        const overlay_elements = document.querySelectorAll('#overlay');
        overlay_elements.forEach(element => {
            if (!element.classList.contains('disable')) {
                element.classList.add('disable');
            }
        });
    }

    if (prev_turn === 'zombiaki') moveLudzie();
}

export function resetUsableCards() {
    const overlay_elements = document.querySelectorAll('#overlay');
    overlay_elements.forEach(element => {
        element.classList.remove('disable');
    })
}

function moveZombiaki() {
    if (!move_zombiaki) {
        move_zombiaki = true;
        return;
    }
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

                //funkcja sprawdzająca mur i sume zombiaków

                //sprawdzenie czy zombiak nie wszedł na minę / beczkę

                putPicture(board[i + 1][j], card);
                moveOverlay(board[i][j], board[i + 1][j]);
                unsetField(board[i][j]);


            }
        }
    }
}

function moveOverlay(old_field, new_field) {
    const overlay = old_field.element.getAttribute('data-overlay');
    console.log('move overlay: ', overlay);
    if (overlay === "null") return;

    const card_overlay = old_field.card_overlay;
    old_field.card_overlay = null;
    const { id, race } = card_overlay;
    const callback = `${race}_id_${id}_callback`;

    if (overlay !== false) {
        addOverlay(card_overlay, new_field, raceFunctions[callback]);
    }

}

function moveLudzie() {
    console.log('ludzie idą do przodu');
}

function putCard(field, card) {
    const { element } = field;
    element.classList.add('field_available', `${card.race}`);
    const handler = setFieldHandler(field, card);
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

function setFieldHandler(field, card) {
    return function () {
        setField(field, card);
    }
}

function putPicture(field, card) {
    const { id, name, race, type } = card;
    const { element } = field;
    const degrees = Math.floor(Math.random() * (5 - -5) + -5);
    element.innerHTML = `<img src='images/cards/${race}/${id}.webp' style="transform: rotate(${degrees}deg)" alt='card'/>`;
    if (card.hp) {
        element.innerHTML += `<div data-max_hp="${card.max_hp}" data-current_hp="${card.hp}" style="transform: rotate(${degrees}deg)"/>`
    }
    element.dataset.id = id;
    element.dataset.name = name;
    element.dataset.type = type;
    field.card = card;
}

function cardFunction(card) {
    const { id, race, type, special } = card;
    if (type === "zombiak" && !special) {
        putZombiak(card);
        return;
    }
    const functionName = `${race}_id_${id}`;
    raceFunctions[functionName](card, active_field);
}

export function setMoveZombiaki(value) {
    move_zombiaki = value;
}

function cancelCard(card) {
    //pokaż przycisk anulowania
}