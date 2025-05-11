//BETONOWE BUCIKI

import { board, clearBoard } from "../board.js";
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable } from "../utils.js";
import { addOverlay } from "../zombiaki/utils.js";

export default function ludzie_id_27(card, field) {
    concreteShoes(card);
}

function concreteShoes(card) {
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j]
            const { element } = field;
            if (!field.card) continue;
            if (field.card.type !== 'zombiak') continue;
            element.classList.add('overlay_available');
            const handler = concreteShoesHandler(card, field);
            element.addEventListener('click', handler);
            element.handler = handler;
        }
    }
}

function concreteShoesHandler(card, field) {
    return function () {
        addOverlay(card, field, null);
        enable(deck_ludzie_element);
        removeCard();
        clearBoard();
    }
}