//AUTO

import { board, putCard } from "../board.js";
import { disable } from "../utils.js";
import { deck_humans_element } from "../index.js";

export default function humans_id_29(card, field) {
    disable(deck_humans_element);
    let mur_track = null;
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];

            if (field?.card_board?.mur) {
                disable(field.element);
                mur_track = j;
                continue;
            }

            if (j === mur_track) {
                disable(field.element);
                continue;
            }

            if (field.card || field.card_board) {
                disable(field.element);
                continue;
            }

            putCard(board[i][j], card);
        }
    }
}
