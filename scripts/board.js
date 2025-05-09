import { raceFunctions } from "./allFunctions.js";
import { gameOver, removeCard } from "./index.js";
import { addOverlay } from "./zombiaki/utils.js";
import { show, hide, enable, disable, randomRotate } from "./utils.js";
import { killZombiak, damageZombiak } from "./ludzie/utils.js";

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
    const web_elements = document.querySelectorAll('.webbed');
    web_elements.forEach(element =>
        element.classList.remove('webbed')
    )
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
            const old_field = board[i][j];
            const { element, card } = old_field;
            if (!card) continue;
            if (card.type === "zombiak" && !card.special) {
                if (i === 4) {
                    gameOver('zombiaki');
                    return;
                }
                moveSingleZombiak(old_field, card, 'front');
            }
        }
    }
}

export function moveSingleZombiak(old_field, card, direction) {
    const { element } = old_field;

    if (element.classList.contains('webbed')) return;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    if (checkZapora(tor)) return;

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

    let is_beczka = next_field?.card_board && next_field?.card_board.name === 'BECZKA';
    let is_dziura = next_field?.card_board &&
        next_field?.card_board.name === 'DZIURA' &&
        old_field.card.hp <= 2;

    if (checkMur(new_tor, przecznica, next_field)) return;

    if (!next_field) return;
    const next_field_is_taken = !!(next_field.card && !next_field.card.walkable);
    if (next_field_is_taken) return;
    if (is_beczka || is_dziura) unsetField(next_field);
    putPicture(next_field, card);
    if (old_field.card_overlay) moveOverlay(old_field, next_field);
    if (is_beczka || is_dziura) killZombiak(next_field);
    unsetField(old_field);
    checkMina(next_field);
}

function checkMina(field) {
    const { card_board } = field;
    if (!card_board) return;
    if (card_board.name !== 'MINA') return;
    setTimeout(() => blowMina(field), 10);
}

function blowMina(field) {
    const { card_board, card, element } = field;
    if (card && card.type === 'zombiak') damageZombiak(card_board.dmg, field);
    field.card_board = null;


    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    const all_fields = [board[przecznica][tor]];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        all_fields.push(board[p][t]);
    }

    for (let i = 0; i < all_fields.length; i++) {
        const { card } = all_fields[i];
        if (!card) continue;
        //AKTYWACJA AUTA
        console.log(all_fields[i].element);
        console.log(all_fields[i].card);
        if (card.type === 'zombiak') {
            console.log('zombiak');
            damageZombiak(1, all_fields[i])
        }
    }
    const mina_element = element.querySelector('.field_board');
    mina_element.remove();
}

export function moveOverlay(old_field, new_field) {
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
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card } = board[i][j];
            if (!card) continue;
            if (card.name === 'ZAPORA') unsetField(board[i][j]);
            if (card.name !== 'BECZKA') continue;

            unsetField(board[i][j]);
            if (i === 0) continue;
            const new_field = board[i - 1][j];
            if (!new_field.card) {
                setField(new_field, card);
                continue;
            }
            if (new_field.card.name === 'DZIURA') {
                unsetField(new_field);
                continue;
            }
            if (new_field.card.name === 'MUR' ||
                new_field.card.name === 'RUPIECI' ||
                new_field.card.name === 'AUTO') continue;
            if (new_field.card.type === 'zombiak') {
                killZombiak(new_field);
                continue;
            }
        }
    }

}

export function putCard(field, card) {
    const { element } = field;
    element.classList.add('field_available', `${card.race}`);
    const handler = setFieldHandler(field, card);
    element.handler = handler;
    element.addEventListener('click', handler);
}

export function unsetField(board_field, board_card = false) {
    const { element } = board_field;

    if (board_card) {
        element.innerHTML = '';
        board_field.card_board = null;
    }

    const card_element = element.querySelector('.field_image');
    if (card_element) card_element.remove();
    const overlay_element = element.querySelector('#overlay');
    if (overlay_element) overlay_element.remove();
    element.dataset.id = null;
    element.dataset.name = null;
    element.dataset.type = null;
    element.dataset.overlay = null;
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
    if (!other) removeCard();
    const cancel_button = document.getElementById('cancel');
    hide(cancel_button);
    if (card.race === 'zombiaki') {
        const zombiaki_deck = document.getElementById('deck_zombiaki');
        if (!other) enable(zombiaki_deck);
    }
    if (card.race === 'ludzie') {
        const ludzie_deck = document.getElementById('deck_ludzie');
        if (!other) enable(ludzie_deck);
    }
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
    if (card.board && card.walkable && card.name !== 'BECZKA') {
        field.card_board = card;
        divElement.classList.remove('field_image');
        divElement.classList.add('field_board');
        return;
    }
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
        clearBoard();
        const cancel_button = document.getElementById('cancel');
        hide(cancel_button);
        const deck = document.getElementById(`deck_${race}`);
        enable(deck);
        const all_fields = document.querySelectorAll('.field');
        all_fields.forEach(field => enable(field));
        const tor_elements = document.querySelectorAll('.tor_electricity');
        tor_elements.forEach(el => {
            hide(el);;
            el.removeEventListener('click', el.handler);
            el.handler = null;
        });
    }
}

export function clearBoard() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element } = field;
            if (element.classList.contains('webbed')) element.className = 'webbed';
            else element.className = '';
            element.classList.add('field');
            const cards_on_field = element.querySelectorAll('.field > div');
            cards_on_field.forEach(el => {
                el.removeEventListener('click', el.shot_handler);
                el.shot_handler = null;
            })
            element.removeEventListener('click', element.handler);
            element.handler = null;
            if (element.handler_mouseover) {
                element.removeEventListener('mouseover', element.handler_mouseover);
                element.handler_mouseover = null;
            }
            if (element.handler_mouseout) {
                element.removeEventListener('mouseout', element.handler_mouseout);
                element.handler_mouseout = null;
            }
        }
    }
}

function checkZapora(tor) {
    const field = board[4][tor];

    const card_przecznica = field.card;
    if (!card_przecznica) return false;
    if (card_przecznica.name === 'ZAPORA') return true;
}

function checkMur(tor, przecznica, next_field) {
    let is_mur = next_field?.card_board && next_field?.card_board.mur;
    if (!is_mur) return false;
    const mur_hp = next_field.card_board.hp;
    let summary_hp = 0;
    for (let i = przecznica; i >= 0; i--) {
        if (board[i][tor]?.card && board[i][tor]?.card.type === 'zombiak') {
            summary_hp += +board[i][tor].card.hp;
        }
    }
    if (mur_hp > summary_hp) return true;
    return false;
}