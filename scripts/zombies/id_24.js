//GŁÓD
import { board, checkMur, checkZapora, clearBoard, moveSingleZombie } from "../board.js";
import { deck_zombies_element, removeCard } from "../index.js";
import { enable, disable, addListener } from "../utils.js";

export default function zombies_id_24(card, field) {
    disable(deck_zombies_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, element } = field;
            if (!card) continue;
            if (card.type !== 'zombie') continue;
            if (i < 4) {
                if (checkMur(j, i, board[i + 1][j])) continue;
                if (checkZapora(board[i][j])) continue;
            }
            addListener(element, handleHunger(field), { once: true });
            element.classList.add('move_on');
        }
    }
}

function handleHunger(field) {
    return function () {
        moveSingleZombie(field, field.card, 'front');
        clearBoard();
        enable(deck_zombies_element);
        removeCard();
    }
}