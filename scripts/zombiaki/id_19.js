//BOSS

import { deleteOverlay, putOverlay } from "./utils.js";
import { board, checkZapora, clearBoard, moveSingleZombie } from "../board.js";
import { addListener, disable, enable, hide, removeListener, show, showAlert } from "../utils.js";
import { deck_zombies_element, cancel_button } from "../index.js";

export default function zombies_id_19(card, field) {
    putOverlay(card, zombies_id_19_callback);
}

export function zombies_id_19_callback(field) {
    bossCommand(field);
}

function bossCommand(boss_field) {
    let available_zombies = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const board_field = board[i][j];
            const { card, element } = board_field;
            if (!card) continue;
            if (card.type !== 'zombie' || card.hp > 3) continue;
            if (card.name === boss_field.card.name && card.id === boss_field.card.id) continue;
            if (checkZapora(board_field)) continue;
            element.classList.add('move_available');
            addListener(element, moveHandler(board_field, boss_field), { once: true });
            available_zombies.push(board[i][j]);
        }
    }
    if (available_zombies.length === 0) {
        showAlert('NIE MOŻNA WYDAĆ ROZKAZU ŻADNEMU ZOMBIAKOWI!');
        return;
    }
    disable(deck_zombies_element);
    show(cancel_button);
}

function moveHandler(field, boss_field) {
    return function () {
        clearBoard();
        setAvailableFields(field, boss_field);
        enable(deck_zombies_element);
    }
}

function setAvailableFields(field, boss_field) {
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
        const field_is_taken = !!(board[p][t].card && !board[p][t].card.walkable);
        if (field_is_taken) continue;
        board[p][t].direction = direction_offset[i];
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((new_field) => {
        const { element } = new_field;
        element.classList.add('move_on');
        const handler_mouseover = hoverHandler(field, new_field);
        element.handler_mouseover = handler_mouseover;
        element.addEventListener('mouseover', handler_mouseover);
        addListener(element, setNewField(field, new_field, boss_field), { once: true });
    })
}

function setNewField(old_field, new_field, boss_field) {
    return function () {
        const { overlay_cards, element } = boss_field;
        const overlay_element = element.querySelector('div[data-name="BOSS"]');
        const hp_element = overlay_element.querySelector('.hp_element');
        const boss_index = overlay_cards.findIndex(card => card.name === 'BOSS');
        overlay_cards[boss_index].hp -= 1;
        hp_element.dataset.current_hp = overlay_cards[boss_index].hp;
        if (overlay_cards[boss_index].hp === 0) {
            deleteOverlay(boss_field, overlay_cards[boss_index].id);
        }
        disable(overlay_element);
        clearBoard();
        moveSingleZombie(old_field, old_field.card, new_field.direction);
        new_field.element.style.backgroundImage = ``;
        removeListener(cancel_button);
        hide(cancel_button);
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
