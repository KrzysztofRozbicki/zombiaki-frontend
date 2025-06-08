//WIADRO

import { board, clearBoard, moveSingleZombie } from "../board.js";
import {
    deck_zombies_element,
    setMinCardsThrown,
    removeCard,
    cancel_button,
    play_card,
    throw_card,
    close_card
} from "../index.js";
import { damageZombie } from "../humans/utils.js";
import { hide, show, disable, enable, addListener } from "../utils.js";

export default function zombies_id_10(card, field) {
    show(close_card);
    disable(deck_zombies_element);
    setMinCardsThrown(1);
    disable(cancel_button);

    const all_zombies = checkAllzombies();

    if (all_zombies.length === 0) {
        finishBucket();
        return;
    }

    const zombies_to_move = checkMovezombies(all_zombies);
    if (zombies_to_move.length === 0) {
        setFieldsToDamage(all_zombies);
    } else {
        setFieldsToMove(zombies_to_move);
    }
}

function setFieldsToDamage(all_zombies) {
    all_zombies.forEach(field => {
        const { element } = field;
        addListener(element, damageCardHandler(field), { once: true });
        element.classList.add('shot_available');
    })
}

function damageCardHandler(field) {
    return function () {
        damageZombie(1, field);
        finishBucket();
    }
}

function setFieldsToMove(zombies_to_move) {
    zombies_to_move.forEach(field => {
        const { element } = field;
        addListener(element, moveCardHandler(field), { once: true });
        element.classList.add('move_available');
    })
}

function moveCardHandler(field) {
    return function () {
        moveSingleZombie(field, field.card, 'back');
        finishBucket();
    }
}

function finishBucket() {
    console.log('finishing');
    clearBoard();
    removeCard();
    show(throw_card);
    hide(play_card);
    enable(deck_zombies_element);
    hide(cancel_button);
    enable(cancel_button);
}

function checkAllzombies() {
    const all_zombies = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card } = field;
            if (!card) continue;
            if (card.type !== 'zombie') continue;
            all_zombies.push(field);
        }
    }
    return all_zombies;
}

function checkMovezombies(all_zombies) {
    const zombies_to_move = [];
    for (let i = 0; i < all_zombies.length; i++) {
        const field = all_zombies[i];
        const { element } = field;
        const t = +element.dataset.tor - 1;
        const p = +element.dataset.przecznica - 1;
        if (p === 0) continue;
        const new_field = board[p - 1][t];
        if (new_field?.card?.type === 'zombie' || new_field?.card_board?.mur) continue;
        zombies_to_move.push(field);
    }
    return zombies_to_move;
}