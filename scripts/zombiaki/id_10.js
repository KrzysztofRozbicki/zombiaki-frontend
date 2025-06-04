//WIADRO

import { board, clearBoard, moveSingleZombiak } from "../board.js";
import {
    deck_zombiaki_element,
    setMinCardsThrown,
    removeCard,
    cancel_button,
    play_card,
    throw_card,
    close_card
} from "../index.js";
import { damageZombiak } from "../ludzie/utils.js";
import { hide, show, disable, enable, addListener } from "../utils.js";

export default function zombiaki_id_10(card, field) {
    show(close_card);
    disable(deck_zombiaki_element);
    setMinCardsThrown(1);
    disable(cancel_button);

    const all_zombiaki = checkAllZombiaki();

    if (all_zombiaki.length === 0) {
        finishBucket();
        return;
    }

    const zombiaki_to_move = checkMoveZombiaki(all_zombiaki);
    if (zombiaki_to_move.length === 0) {
        setFieldsToDamage(all_zombiaki);
    } else {
        setFieldsToMove(zombiaki_to_move);
    }
}

function setFieldsToDamage(all_zombiaki) {
    all_zombiaki.forEach(field => {
        const { element } = field;
        addListener(element, damageCardHandler(field), { once: true });
        element.classList.add('shot_available');
    })
}

function damageCardHandler(field) {
    return function () {
        damageZombiak(1, field);
        finishBucket();
    }
}

function setFieldsToMove(zombiaki_to_move) {
    zombiaki_to_move.forEach(field => {
        const { element } = field;
        addListener(element, moveCardHandler(field), { once: true });
        element.classList.add('move_available');
    })
}

function moveCardHandler(field) {
    return function () {
        moveSingleZombiak(field, field.card, 'back');
        finishBucket();
    }
}

function finishBucket() {
    clearBoard();
    removeCard();
    show(throw_card);
    hide(play_card);
    enable(deck_zombiaki_element);
    enable(cancel_button);
}

function checkAllZombiaki() {
    const all_zombiaki = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card } = field;
            if (!card) continue;
            if (card.type !== 'zombiak') continue;
            all_zombiaki.push(field);
        }
    }
    return all_zombiaki;
}

function checkMoveZombiaki(all_zombiaki) {
    const zombiaki_to_move = [];
    for (let i = 0; i < all_zombiaki.length; i++) {
        const field = all_zombiaki[i];
        const { element } = field;
        const t = +element.dataset.tor - 1;
        const p = +element.dataset.przecznica - 1;
        if (p === 0) continue;
        const new_field = board[p - 1][t];
        if (new_field?.card?.type === 'zombiak' || new_field?.card_board?.mur) continue;
        zombiaki_to_move.push(field);
    }
    return zombiaki_to_move;
}