//MINA

import { board, putCard } from "../board.js";
import { disable } from "../utils.js";
import { deck_humans_element } from "../index.js";
export default function humans_id_25(card, field) {
    placeMina(card);
}

function placeMina(card) {
    disable(deck_humans_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].card || board[i][j].card_board) continue;
            if (i - 1 >= 0 && board[i - 1][j].card && board[i - 1][j].card.type === 'zombie') continue;
            putCard(board[i][j], card);
        }
    }
}