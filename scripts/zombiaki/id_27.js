//MASA
import { board, clearBoard, setField, unsetField } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { disable, enable } from "../utils.js";
import { zombiak_masa } from "./cards.js";
export default function zombiaki_id_27(card, field) {
    putMasa();
}

let masa_card = zombiak_masa;

function putMasa() {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, element } = field;
            if (card?.type !== 'zombiak') continue;
            element.classList.add('move_available');
            const handler = choseZombiakHandler(field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}

function choseZombiakHandler(field) {
    return function () {
        clearBoard();
        setAvailableFields(field);
    }
}


function setAvailableFields(field) {
    const { element } = field;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    const all_fields = [];
    const direction_offset = ['front', 'back', 'left', 'right'];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        const field_is_available = !!(board[p][t]?.card?.type === 'zombiak');
        if (!field_is_available) continue;
        board[p][t].direction = direction_offset[i];
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((new_field) => {
        const { element } = new_field;
        element.classList.add('move_on');
        const handler_mouseover = hoverHandler(field, new_field);
        element.handler_mouseover = handler_mouseover;
        element.addEventListener('mouseover', handler_mouseover);
        const handler = putMasaHandler(field, new_field);
        element.addEventListener('click', handler, { once: true });
        element.handler = handler;
    })
}

function putMasaHandler(field, new_field) {
    return function () {
        const new_max_hp = field.card.max_hp + new_field.card.max_hp;
        const new_hp = field.card.hp + new_field.card.hp;
        masa_card.max_hp = new_max_hp;
        masa_card.hp = new_hp;
        unsetField(new_field);
        unsetField(field);
        setField(new_field, masa_card);
        enable(deck_zombiaki_element);
    }
}


function hoverHandler(old_field, new_field) {
    return function () {
        const handler = outHandler(old_field, new_field);
        new_field.element.addEventListener('mouseout', handler, { once: true })
        new_field.element.handler_mouseout = handler;
        new_field.element.classList.add('background_image');
        const { card } = old_field;
        const { id, race } = card;
        new_field.element.style.setProperty('--bg-image', `url('../images/cards/${race}/${id}.webp')`)
        old_field.element.classList.add('no_image');
    }
}

function outHandler(old_field, new_field) {
    return function () {
        new_field.element.classList.remove('background_image');
        new_field.element.style.removeProperty('--bg-image');
        old_field.element.classList.remove('no_image');
    }
}