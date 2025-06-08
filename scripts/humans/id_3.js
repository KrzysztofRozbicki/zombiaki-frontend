//220V
import { board } from '../board.js';
import { show, hide, enable, disable, addListener, removeListener } from '../utils.js';
import { removeCard, deck_humans_element } from '../index.js';
import { damageZombie } from './utils.js';
export default function humans_id_3(card, field) {
    shockFunction();
}


function shockFunction() {
    disable(deck_humans_element);
    const tor_elements = document.querySelectorAll('.tor_electricity');
    tor_elements.forEach(el => {
        show(el);
        const tor = el.parentNode;
        addListener(el, shockTorHandler(tor), { once: true });
    });
}

function shockTorHandler(tor) {
    return function () {
        shockTor(tor);
    }
}

function shockTor(tor) {
    const id = tor.getAttribute('id');
    const tor_index = +id.slice(-1) - 1;

    for (let i = 0; i < board.length; i++) {
        const field = board[i][tor_index];
        const { card, card_pet } = field;
        if (card?.type === 'zombie' || card_pet) damageZombie(1, field);
    }
    enable(deck_humans_element);
    removeCard();
    const tor_elements = document.querySelectorAll('.tor_electricity');
    tor_elements.forEach(el => {
        hide(el);
        removeListener(el);
    });
}