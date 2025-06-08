//ROPA

import { board } from "../board.js";
import { deck_humans_element } from '../index.js';
import { aoeHandler } from "./utils.js";
import { addListener, disable } from "../utils.js";

export default function humans_id_5(card, field) {
    ropa(card);
}


function ropa(card) {
    disable(deck_humans_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element } = field;
            element.classList.add('ropa_available');
            addListener(element, aoeHandler(field, card));
        }
    }
}



