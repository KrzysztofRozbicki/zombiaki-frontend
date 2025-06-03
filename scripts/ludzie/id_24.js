//MIOTACZ
import { board } from '../board.js';
import { disable } from '../utils.js';
import { deck_ludzie_element } from '../index.js';
import { aoeHandler } from "./utils.js";

export default function ludzie_id_24(card, field) {
    miotacz(card);
}

function miotacz(card) {
    disable(deck_ludzie_element);
    const przecznica = checkPrzecznica();
    for (let i = 0; i < board[przecznica].length; i++) {
        const field = board[przecznica][i];
        const { element } = field;
        let burn_krystynka = true;
        let is_krystynka = false;
        if (field?.card?.name === 'KRYSTYNKA') {
            is_krystynka = true;
            const tor_krystynka = +element.dataset.tor - 1;
            for (let tor = 0; tor < board[przecznica].length; tor++) {
                const field = board[przecznica][tor];
                const { card, card_pet } = field;
                if (tor === tor_krystynka) continue;
                if (card?.type === 'zombiak' || card_pet) {
                    burn_krystynka = false;
                    continue;
                }
            }
        }

        if (!burn_krystynka) continue;
        element.classList.add('miotacz_available');
        const handler = aoeHandler(field, card, { is_krystynka: true });
        element.addEventListener('click', handler);
        element.handler = handler;
    }
}

function checkPrzecznica() {
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { card } = board[i][j];
            if (!card) continue;
            if (card.type === 'zombiak') return i;
        }
    }
}