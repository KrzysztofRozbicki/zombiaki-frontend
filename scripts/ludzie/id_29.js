//AUTO

import { board, putCard } from "../board.js";
import { disable } from "../utils.js";
import { deck_ludzie_element } from "../index.js";

export default function ludzie_id_29(card, field) {
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].card || board[i][j].card_board) continue;
            putCard(board[i][j], card);
        }
    }
}