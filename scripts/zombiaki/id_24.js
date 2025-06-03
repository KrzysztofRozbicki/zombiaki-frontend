//GŁÓD
import { board, checkMur, checkZapora, clearBoard, moveSingleZombiak } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable } from "../utils.js";

export default function zombiaki_id_24(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, element } = field;
            if (!card) continue;
            if (card.type !== 'zombiak') continue;
            if (i < 4) {
                if (checkMur(j, i, board[i + 1][j])) continue;
                if (checkZapora(board[i][j])) continue;
            }


            const handler = handleHunger(field);
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