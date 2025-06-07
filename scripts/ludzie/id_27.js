//BETONOWE BUCIKI

import { board, clearBoard } from "../board.js";
import { deck_humans_element, removeCard } from "../index.js";
import { addListener, disable, enable } from "../utils.js";
import { addOverlay } from "../zombies/utils.js";

export default function humans_id_27(card, field) {
    concreteShoes(card);
}

function concreteShoes(card) {
    disable(deck_humans_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j]
            const { element } = field;
            if (!field.card) continue;
            if (field.card.type !== 'zombie') continue;
            element.classList.add('overlay_available');
            addListener(element, concreteShoesHandler(card, field));
        }
    }
}

function concreteShoesHandler(card, field) {
    return function () {
        addOverlay(card, field, null);
        enable(deck_humans_element);
        removeCard();
        clearBoard();
    }
}