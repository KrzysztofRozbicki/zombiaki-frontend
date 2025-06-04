//KILOF
import { board, clearBoard, unsetField } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable, addListener } from "../utils.js";

export default function zombiaki_id_8(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j]
            const { card_board, element } = field;
            if (!card_board) continue;
            if (card_board.name === 'DZIURA') continue;
            const kilof_element = element.querySelector('.field_board');
            kilof_element.classList.add('kilof_available');
            addListener(element, handleKilof(field), { once: true });
        }
    }
}

function handleKilof(field) {
    return function () {
        unsetField(field, { board_card: true });
        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}