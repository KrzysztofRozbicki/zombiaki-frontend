//GAZ ROZWESELAJĄCY
import { board, clearBoard } from "../board.js";
import { deck_ludzie_element, removeCard } from "../index.js";
import { disable, enable, hide, show } from "../utils.js";
export default function ludzie_id_14(card, field) {
    happyGas();
}

let gas_amount = 2;

function happyGas() {
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
        gas_amount -= 1;
        if (gas_amount === 0) {
            removeCard();
            enable(deck_ludzie_element);
            clearBoard('gased');
            return;
        }
        const { element, card } = field;
        element.classList.add('gased');
        //Dodać eventListener do pola który pokazuje krzyż do wyboru (setAvailableElements) i przesuwa tam zombiaka;
        //happyGas();
    }
}

function setAvailableFields(field) {
    const { element } = field;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    const all_fields = [board[przecznica][tor]];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((field) => {
        const { element } = field;
        element.classList.add('gas_available');
    })
}