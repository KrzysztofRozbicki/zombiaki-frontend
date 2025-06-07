//MIOTACZ
import { board } from '../board.js';
import { addListener, disable } from '../utils.js';
import { deck_humans_element } from '../index.js';
import { aoeHandler } from "./utils.js";

export default function humans_id_24(card, field) {
    miotacz(card);
}

function miotacz(card) {
    disable(deck_humans_element);
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
                if (card?.type === 'zombie' || card_pet) {
                    burn_krystynka = false;
                    continue;
                }
            }
        }

        if (!burn_krystynka) continue;
        element.classList.add('miotacz_available');
        addListener(element, aoeHandler(field, card, { is_krystynka: true }));
    }
}

function checkPrzecznica() {
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { card } = board[i][j];
            if (!card) continue;
            if (card.type === 'zombie') return i;
        }
    }
}