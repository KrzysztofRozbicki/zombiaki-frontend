//KILOF
import { board, clearBoard } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { enable, disable } from "../utils.js";

const destroyable = ['AUTO', 'MINA', 'MUR', 'MUR Z RUPIECI', 'ZAPORA', 'BECZKA']

export default function zombiaki_id_8(card, field) {
    disable(deck_zombiaki_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const { card_board, element } = board[i][j];
            if (!card_board) continue;
            if (card_board.name === 'DZIURA') continue;
            const kilof_element = element.querySelector('.field_board');
            kilof_element.classList.add('kilof_available');
            const handler = handleKilof(kilof_element);
            kilof_element.handler = handler;
            kilof_element.addEventListener('click', handler, { once: true });
        }
    }
}

function handleKilof(element) {
    return function () {
        element.remove();
        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}