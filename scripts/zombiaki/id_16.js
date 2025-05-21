//PAZURY
import { board, clearBoard } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable } from "../utils.js";

export default function zombiaki_id_16(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card, element } = board[i][j];
            if (!card) continue;
            if (card.type !== 'zombiak' || card.pet) continue;
            const handler = handlePazury(board[i][j]);
            element.addEventListener('click', handler, { once: true });
            element.handler = handler;
            element.classList.add('papu_available');
        }
    }
}

function handlePazury(field) {
    return function () {
        const { card, element } = field;
        card.hp += 1;
        const hp_element = element.querySelector('.field_image > div');
        hp_element.dataset.current_hp = card.hp;
        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}