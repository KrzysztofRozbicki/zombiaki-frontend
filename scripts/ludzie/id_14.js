//GAZ ROZWESELAJĄCY
import { board, clearBoard, moveSingleZombiak } from "../board.js";
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable, hideCancelButton } from "../utils.js";


let gas_amount = 2;

export default function ludzie_id_14(card, field) {
    happyGas();
    gas_amount = 2;
}

function happyGas() {
    if (gas_amount === 1) hideCancelButton();
    if (gas_amount === 0) {
        removeCard();
        enable(deck_ludzie_element);
        clearBoard('gased');
        return;
    }
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { element, card } = field;
            if (!card) continue;
            if (card.type !== 'zombiak' || element.classList.contains('gased')) continue;
            element.classList.add('gas_available');
            const handler = gasHandler(field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}

function gasHandler(field) {
    return function () {
        clearBoard('gas_available');
        setAvailableFields(field);
    }
}

function setAvailableFields(field) {
    const { element } = field;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[0, 1], [0, -1], [-1, 0], [1, 0]];
    const all_fields = [];
    const direction_offset = ['front', 'back', 'left', 'right'];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        const field_is_taken = !!(board[p][t].card && !board[p][t].card.walkable);
        if (field_is_taken) continue;
        board[p][t].direction = direction_offset[i];
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((new_field) => {
        const { element } = new_field;
        element.classList.add('move_on');
        const handler_mouseover = hoverHandler(field, new_field);
        element.handler_mouseover = handler_mouseover;
        element.addEventListener('mouseover', handler_mouseover);
        const handler = setNewField(field, new_field);
        element.addEventListener('click', handler, { once: true });
        element.handler = handler;
    })
}

function setNewField(old_field, new_field) {
    return function () {
        clearBoard('move_on');
        clearBoard('no_image');
        console.log(new_field);
        moveSingleZombiak(old_field, old_field.card, new_field.direction);
        new_field.element.classList.add('gased');
        gasHandler();
        new_field.element.style.backgroundImage = ``;
        gas_amount -= 1;
        happyGas();
    }
}

function hoverHandler(old_field, new_field) {
    return function () {
        const handler = outHandler(old_field, new_field);
        new_field.element.addEventListener('mouseout', handler, { once: true })
        new_field.element.handler_mouseout = handler;
        new_field.element.classList.add('background_image');
        const { card } = old_field;
        const { id, race } = card;
        new_field.element.style.backgroundImage = `url('../images/cards/${race}/${id}.webp')`;
        old_field.element.classList.add('no_image');
    }
}

function outHandler(old_field, new_field) {
    return function () {
        new_field.element.classList.remove('background_image');
        new_field.element.style.backgroundImage = ``;
        old_field.element.classList.remove('no_image');
    }
}