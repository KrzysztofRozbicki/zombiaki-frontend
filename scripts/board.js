import { raceFunctions } from "./allFunctions.js";
import { gameOver, removeCard, setActiveCard } from "./index.js";
import { addOverlay } from "./zombiaki/utils.js";
import { show, hide, enable, disable, randomRotate } from "./utils.js";

import { cards_ludzie_json } from "./ludzie/cards.js";
import { cards_zombiaki_json } from "./zombiaki/cards.js";

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



export const board = [
    [{ element: T1_P1 }, { element: T2_P1 }, { element: T3_P1 }],
    [{ element: T1_P2 }, { element: T2_P2 }, { element: T3_P2 }],
    [{ element: T1_P3 }, { element: T2_P3 }, { element: T3_P3 }],
    [{ element: T1_P4 }, { element: T2_P4 }, { element: T3_P4 }],
    [{ element: T1_P5 }, { element: T2_P5 }, { element: T3_P5 }],
];

export function placeCard(card) {
    cardFunction(card);
    cancelCard(card);
}

export function putZombiak(card) {
    const zombiaki_deck = document.getElementById('deck_zombiaki');
    disable(zombiaki_deck);
    for (let i = 0; i < board[0].length; i++) {
        if (board[0][i].card) continue;
        putCard(board[0][i], card);
    }
}

export function updateBoard(prev_turn) {
    const overlay_elements = document.querySelectorAll('#overlay');
    overlay_elements.forEach(element => {
        enable(element);
    });
    if (prev_turn === 'ludzie') {
        moveZombiaki();

        const overlay_elements = document.querySelectorAll('#overlay');
        overlay_elements.forEach(element => {
            if (!element.classList.contains('disable')) {
                disable(element);
            }
        });
    }
    if (prev_turn === 'zombiaki') moveLudzie();


}

export function resetUsableCards() {
    const overlay_elements = document.querySelectorAll('#overlay');
    overlay_elements.forEach(element => {
        enable(element);
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

                const old_field = board[i][j];
                moveSingleZombiak(old_field, card, 'front');
            }
        }
    }
}

export function moveSingleZombiak(old_field, card, direction) {
    const { element } = old_field;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    let new_field = null;

    const direction_offset = {
        'front': [1, 0],
        'back': [-1, 0],
        'left': [0, -1],
        'right': [0, 1],
    }

    const [przecznica_offset, tor_offset] = direction_offset[direction];
    const new_przecznica = przecznica + przecznica_offset;
    const new_tor = tor + tor_offset;
    if (new_przecznica < 0 || new_tor < 0 || new_tor > 2) return;
    const next_field = board[new_przecznica][new_tor];
    if (!next_field) return;
    const next_field_is_taken = !!(next_field.card && !next_field.card.walkable);
    if (next_field_is_taken) return;
    new_field = next_field;

    putPicture(new_field, card);
    if (old_field.card_overlay) moveOverlay(old_field, new_field);
    unsetField(old_field);
}


function moveOverlay(old_field, new_field) {
    const overlay = old_field.element.getAttribute('data-overlay');
    if (!overlay || overlay === "null") return;

    const card_overlay = old_field.card_overlay;
    old_field.card_overlay = null;
    const { id, race } = card_overlay;
    const callback = `${race}_id_${id}_callback`;

    if (overlay !== false) {
        addOverlay(card_overlay, new_field, raceFunctions[callback]);
    }

}

function moveLudzie() {

}

function putCard(field, card) {
    const { element } = field;
    element.classList.add('field_available', `${card.race}`);
    const handler = setFieldHandler(field, card);
    element.handler = handler;
    element.addEventListener('click', handler);
}

export function unsetField(board_field) {
    const field = board_field.element;
    field.innerHTML = ``
    field.dataset.id = null;
    field.dataset.name = null;
    field.dataset.type = null;
    field.dataset.overlay = null;
    board_field.card = null;
}

export function setField(field, card, other = false) {
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
    if (!other) enable(zombiaki_deck);
    const cancel_button = document.getElementById('cancel');
    hide(cancel_button);
    if (!other) removeCard();
}

function setFieldHandler(field, card) {
    return function () {
        setField(field, card);
        const cancel_button = document.getElementById('cancel');
        cancel_button.removeEventListener('click', cancel_button.handler);
        cancel_button.handler = null;
    }
}

function putPicture(field, card) {

    const { id, name, race, type, hp, max_hp } = card;
    const { element } = field;

    const divElement = document.createElement('div');
    randomRotate(10, divElement);
    divElement.classList.add('field_image')
    const imgElement = document.createElement('img');
    imgElement.src = `images/cards/${race}/${id}.webp`;
    divElement.appendChild(imgElement);

    if (hp) {
        const hpElement = document.createElement('div');
        hpElement.dataset.max_hp = max_hp;
        hpElement.dataset.current_hp = hp;
        hpElement.dataset.card_id = id;
        divElement.appendChild(hpElement);
    }

    element.append(divElement);

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
    const { board, race } = card;
    if (!board) return;
    const cancel_button = document.getElementById('cancel');
    show(cancel_button);
    cancel_button.classList.add(`${race}_active`);
    const handler = handleCancelCard(card);
    cancel_button.handler = handler;
    cancel_button.addEventListener('click', handler, { once: true });
}

function handleCancelCard(card) {
    return function () {
        const { race } = card;
        const cancel_button = document.getElementById('cancel');
        hide(cancel_button);
        const deck = document.getElementById(`deck_${race}`);
        enable(deck);
        for (let i = board.length - 1; i >= 0; i--) {
            for (let j = 0; j < board[i].length; j++) {
                const { element } = board[i][j];
                element.classList = null;
                element.classList.add('field');
                element.removeEventListener('click', element.handler);
                element.handler = null;
                const cards_on_field = element.querySelectorAll('.field > div');
                cards_on_field.forEach(el => {
                    el.removeEventListener('click', el.shot_handler);
                    el.shot_handler = null;
                })
            }
        }
        const all_fields = document.querySelectorAll('.field');
        all_fields.forEach(field => enable(field));
        const tor_elements = document.querySelectorAll('.tor_arrow');
        tor_elements.forEach(el => {
            hide(el);;
            el.removeEventListener('click', el.handler);
            el.handler = null;
        });
    }
}