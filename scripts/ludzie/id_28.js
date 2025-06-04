//GRANAT
import { board, unsetField, clearBoard } from "../board.js";
import { addListener, disable, enable } from "../utils.js";
import { deck_ludzie_element, removeCard } from "../index.js";
import { killZombiak } from "./utils.js";
export default function ludzie_id_28(card, field) {
    grenade();
}

function grenade() {
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const { element } = board[i][j];
            element.classList.add('grenade_available');
            addListener(element, grenadeHandler(board[i][j]));
        }
    }
}

function grenadeHandler(field) {
    return function () {
        unsetField(field, { all: true });
        removeCard();
        enable(deck_ludzie_element);
        clearBoard();
    }
}
