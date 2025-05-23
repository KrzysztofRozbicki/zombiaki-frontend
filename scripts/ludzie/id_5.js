//ROPA

import { board } from "../board.js";
import { deck_ludzie_element } from '../index.js';
import { aoeHandler } from "./utils.js";
import { disable } from "../utils.js";

export default function ludzie_id_5(card, field) {
    ropa(card);
}


function ropa(card) {
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element } = field;
            element.classList.add('ropa_available');

            const handler = aoeHandler(field, card);
            element.addEventListener('click', handler);
            element.handler = handler;
        }
    }
}



