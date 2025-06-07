
//ULICA W OGNIU
import { board, checkBlowField } from '../board.js';
import { show, hide, enable, disable, addListener, removeListener } from '../utils.js';
import { removeCard, deck_humans_element } from '../index.js';
import { damageZombie } from './utils.js';

export default function humans_id_9(card, field) {
    streetFire();
}

function streetFire() {
    disable(deck_humans_element);
    const tor_elements = document.querySelectorAll('.tor_fire');
    tor_elements.forEach(el => {
        show(el);
        const tor = el.parentNode;
        addListener(el, fireTorHandler, { once: true });
    });
}

function fireTorHandler(tor) {
    return function () {
        fireTor(tor);
    }
}

function fireTor(tor) {
    const id = tor.getAttribute('id');
    const tor_index = +id.slice(-1) - 1;

    for (let i = 0; i < board.length; i++) {
        const field = board[i][tor_index];
        const { card, card_pet } = field;
        checkBlowField(field);
        if (card?.type === 'zombie' || card_pet) damageZombie(1, field);
    }
    enable(deck_humans_element);
    removeCard();
    const tor_elements = document.querySelectorAll('.tor_fire');
    tor_elements.forEach(el => {
        hide(el);
        removeListener(el);
    });
}