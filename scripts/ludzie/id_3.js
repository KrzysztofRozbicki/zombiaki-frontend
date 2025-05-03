//220V
import { board } from '../board.js';
import { show, hide } from '../utils.js';
import { removeCard } from '../index.js';
import { damageZombiak } from './utils.js';
export default function ludzie_id_3(card, field) {
    shockFunction(card);
}


function shockFunction(card) {
    const tor_elements = document.querySelectorAll('.tor_arrow');
    tor_elements.forEach(el => {
        show(el);
        const tor = el.parentNode;
        const handler = shockTorHandler(tor, card);
        el.handler = handler;
        el.addEventListener('click', handler, { once: true });
    });
}

function shockTorHandler(tor, card) {
    return function () {
        shockTor(tor, card);
    }
}

function shockTor(tor, card) {
    const id = tor.getAttribute('id');
    const tor_index = +id.slice(-1) - 1;

    for (let i = 0; i < board.length; i++) {
        const field = board[i][tor_index];
        const { card } = field;
        if (!card) continue;
        if (card.type !== 'zombiak') continue;

        damageZombiak(1, field);
    }

    removeCard(card);
    const tor_elements = document.querySelectorAll('.tor_arrow');
    tor_elements.forEach(el => {
        hide(el);
        el.removeEventListener('click', el.handler);
        el.handler = null;
    });
}