//ZAPORA
import { board, putCard } from "../board.js";
import { disable } from "../utils.js";

export default function humans_id_17(card, field) {
    placeZapora(card);
}

function placeZapora(card, field) {
    const humans_deck = document.getElementById('deck_humans');
    disable(humans_deck);
    for (let i = 0; i < board[4].length; i++) {
        if (board[4][i].card) continue;
        putCard(board[4][i], card);
    }
}