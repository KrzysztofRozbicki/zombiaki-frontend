//MASA
import { board, setField } from "../board.js";
import { deck_zombiaki_element, removeCard } from "../index.js";
import { disable, enable } from "../utils.js";
import { zombiak_masa } from "./cards.js";
export default function zombiaki_id_27(card, field) {
    putMasa();
}

let masa_card = zombiak_masa;

function putMasa() {
    disable(deck_zombiaki_element);

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];
            const { card, card_board, card_pet, element } = field;
            if (card?.type === 'zombiak' || card_board?.name === 'MUR' || card_pet) continue;
            masa_card.hp = 10;
            masa_card.max_hp = 10;
            element.classList.add('field_available');
            const handler = putMasaHandler(field);
            element.handler = handler;
            element.addEventListener('click', handler, { once: true });
        }
    }
}

function putMasaHandler(field) {
    return function () {
        setField(field, zombiak_masa);
        enable(deck_zombiaki_element);
    }
}

