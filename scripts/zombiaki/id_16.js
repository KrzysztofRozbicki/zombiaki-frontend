//PAZURY
import { board, clearBoard } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable } from "../utils.js";
import { addOverlay } from "./utils.js";

export default function zombiaki_id_16(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j]
            const { element } = board[i][j];
            const field_card = field.card;
            if (!field_card) continue;
            if (field_card.type !== 'zombiak' || field_card.pet) continue;
            const handler = handlePazury(card, field);
            element.addEventListener('click', handler, { once: true });
            element.handler = handler;
            element.classList.add('papu_available');
        }
    }
}

function handlePazury(card, field) {
    return function () {
        const { element } = field;
        const field_card = field.card
        field_card.hp += 1;
        const hp_element = element.querySelector('.field_image > div');
        hp_element.dataset.current_hp = field_card.hp;
        addOverlay(card, field, null);
        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}