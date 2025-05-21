//GŁÓD
import { board, clearBoard, moveSingleZombiak } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable } from "../utils.js";

export default function zombiaki_id_24(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card, element } = board[i][j];
            if (!card) continue;
            if (card.type !== 'zombiak') continue;
            const handler = handleHunger(board[i][j]);
            element.addEventListener('click', handler, { once: true });
            element.handler = handler;
            element.classList.add('move_on');
        }
    }
}

function handleHunger(field) {
    return function () {
        moveSingleZombiak(field, field.card, 'front');
        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}