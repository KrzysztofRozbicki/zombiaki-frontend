//WYNOCHA
import { board, moveSingleZombiak } from "../board.js"
export default function ludzie_id_21(card, field) {
    wynocha()
}

function wynocha() {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { element, card } = field;
            if (!card) continue;
            if (card.type !== 'zombiak') continue;
            moveSingleZombiak(field, card, 'back');
        }
    }
}