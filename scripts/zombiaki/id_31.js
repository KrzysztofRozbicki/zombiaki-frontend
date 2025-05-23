//SPADAJ

import { board, clearBoard, setField, unsetField } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { disable, enable } from "../utils.js";
import { addOverlay } from "./utils.js";
import { raceFunctions } from "../allFunctions.js";

export default function zombiaki_id_31(card, field) {
    disable(deck_zombiaki_element);

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, element } = field;
            const is_webbed = element.classList.contains('webbed');
            if (is_webbed) continue;
            if (card?.type !== 'zombiak') continue;
            element.classList.add('move_available');
            const handler = spadajHandler(field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}

function spadajHandler(field) {
    return function () {
        clearBoard();
        const fields = checkAvailableFields(field);
        fields.forEach(board_field => {
            const { element } = board_field;
            element.classList.add('move_available');
            const handler = swapCards(field, board_field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        })
    }
}

function swapCards(old_field, new_field) {
    return function () {
        const old_overlay = old_field.card_overlay;
        const old_card = old_field.card;


        const new_overlay = new_field.card_overlay;
        const new_card = new_field.card;
        unsetField(old_field);
        unsetField(new_field);

        setField(old_field, new_card);
        setField(new_field, old_card)
        if (old_overlay) {
            const { id, race } = old_overlay;
            const callback = `${race}_id_${id}_callback`;
            addOverlay(old_overlay, new_field, raceFunctions[callback]);
        }

        if (new_overlay) {
            const { id, race } = new_overlay;
            const callback = `${race}_id_${id}_callback`;
            addOverlay(new_overlay, old_field, raceFunctions[callback]);
        }


        clearBoard();
        enable(deck_zombiaki_element);
        removeCard();
    }
}

function checkAvailableFields(field) {
    const { element } = field;
    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    const cross = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    let all_fields = [];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > przecznica) continue;
        const board_field = board[p][t];
        const { card, element } = board_field;
        const is_webbed = element.classList.contains('webbed');
        if (is_webbed) continue;
        if (card?.type === 'zombiak') all_fields.push(board_field);;
    }

    return all_fields;
}