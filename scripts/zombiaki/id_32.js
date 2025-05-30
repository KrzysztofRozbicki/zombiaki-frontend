//UGRYZIENIE
import { board, clearBoard, setField } from "../board.js";
import { deck_zombiaki_element, removeCard, cancel_button } from "../index.js";
import { disable, enable, hideCancelButton, showAlert } from "../utils.js";
import { zombiak_1 } from '../zombiaki/cards.js';

export default function zombiaki_id_32(card, field) {
    disable(deck_zombiaki_element);
    checkFields();
}

function checkFields() {
    let is_possible = false;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { overlay_cards, element } = field;
            if (!overlay_cards || overlay_cards.length === 0) continue;
            const is_human = !!overlay_cards.find(card => card.name === 'CZŁOWIEK');
            if (!is_human) continue;
            const available_fields = checkAvailableFields(field);
            if (available_fields.length === 0) continue;
            is_possible = true;
            const handler = handleAvailableFields(field, available_fields);
            element.classList.add('move_available');
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
    if (!is_possible) {
        enable(deck_zombiaki_element);
        showAlert('NIE MOŻESZ ZAGRAĆ UGRYZIENIA - BRAK WOLNYCH PÓL');
        setTimeout(() => hideCancelButton(), 10);
    }
}

function handleAvailableFields(field, available_fields) {
    return function () {
        clearBoard();
        const { element } = field;

        available_fields.forEach(board_field => {
            const { element } = board_field
            element.classList.add('move_on');
            const handler_mouseover = hoverZombiakHandler(field, board_field);
            element.handler_mouseover = handler_mouseover;
            element.addEventListener('mouseover', handler_mouseover);
            const handler = putZombiakHandler(field, board_field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        })
    }
}

function hoverZombiakHandler(old_field, new_field) {
    return function () {
        const handler = outZombiakHandler(old_field, new_field);
        new_field.element.addEventListener('mouseout', handler, { once: true })
        new_field.element.classList.add('background_image');
        new_field.element.handler_mouseout = handler;
        new_field.element.style.setProperty('--bg-image', `url('../images/cards/zombiaki/rewers.webp')`)
    }
}

function outZombiakHandler(old_field, new_field) {
    return function () {
        new_field.element.classList.remove('background_image');
        new_field.element.style.removeProperty('--bg-image');
    }
}

function putZombiakHandler(old_field, new_field) {
    return function () {
        const old_element = old_field.element
        const human_index = old_field.overlay_cards.findIndex(card => card.name === 'CZŁOWIEK');
        old_field.overlay_cards.splice(human_index, 1);
        if (old_field.overlay_cards.length === 0) old_field.overlay_cards = null;
        const human_element = old_element.querySelector('div[data-name="CZŁOWIEK"]');
        human_element.remove();
        setField(new_field, zombiak_1, { other: true });
        clearBoard();
        removeCard();
        enable(deck_zombiaki_element);
    }
}

function checkAvailableFields(field) {
    const { element } = field;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    const cross = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    const all_fields = [];
    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > przecznica) continue;
        const { card, card_board } = board[p][t];
        if (card?.type === 'zombiak' || card_board?.mur) continue;
        all_fields.push(board[p][t]);
    }
    return all_fields;
}