
//ULICA W OGNIU
import { board, checkBlowField } from '../board.js';
import { show, hide, enable, disable } from '../utils.js';
import { removeCard, deck_ludzie_element } from '../index.js';
import { damageZombiak } from './utils.js';

export default function ludzie_id_9(card, field) {
    streetFire();
}

function streetFire() {
    disable(deck_ludzie_element);
    const tor_elements = document.querySelectorAll('.tor_fire');
    tor_elements.forEach(el => {
        show(el);
        const tor = el.parentNode;
        const handler = fireTorHandler(tor);
        el.handler = handler;
        el.addEventListener('click', handler, { once: true });
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
        const { card } = field;
        checkBlowField(field);
        if (!card) continue;
        if (card.type !== 'zombiak') continue;

        damageZombiak(1, field);
    }
    enable(deck_ludzie_element);
    removeCard();
    const tor_elements = document.querySelectorAll('.tor_fire');
    tor_elements.forEach(el => {
        hide(el);
        el.removeEventListener('click', el.handler);
        el.handler = null;
    });
}