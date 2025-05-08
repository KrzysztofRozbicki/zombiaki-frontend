//DZIURA
import { board, putCard } from "../board.js";
import { disable } from "../utils.js";
export default function ludzie_id_15(card, field) {
    placeDziura(card);
}

function placeDziura(card) {
    const ludzie_deck = document.getElementById('deck_ludzie');
    disable(ludzie_deck);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j].card) continue;
            putCard(board[i][j], card);
        }
    }
}

