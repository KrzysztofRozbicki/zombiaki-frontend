//ROPA

import { board, clearBoard } from "../board.js";
import { removeCard, deck_ludzie_element } from '../index.js';
import { damageZombiak } from "./utils.js";
import { hideCancelButton, enable, disable } from "../utils.js";
export default function ludzie_id_5(card, field) {
    ropa(card);
}


function ropa(card) {
    disable(deck_ludzie_element);
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element } = field;
            element.classList.add('ropa_available');

            const handler = ropaHandler(field, card);
            element.addEventListener('click', handler);
            element.handler = handler;
        }
    }
}

function ropaHandler(field, card) {
    return function () {
        activeRopa(field, card);
    }
}

function activeRopa(field, card) {
    const { element } = field;
    hideCancelButton();
    const targetCard = field.card;
    card.dmg -= 1;
    setRopaHealth(card)
    clearBoard('ropa_available');
    if (card.dmg === 0) {
        enable(deck_ludzie_element);
        damageZombiak(1, field);
        return;
    }
    setRopaBoard(field, card);

    //dodanie nowych pól do aktywacji
    if (!targetCard || targetCard.race !== 'zombiaki') return;
    damageZombiak(1, field);
}

function setRopaBoard(field, card) {
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
        element.classList.add('ropa_available');

        const handler = ropaHandler(field, card);
        element.addEventListener('click', handler);
        element.handler = handler;
    })
}

function setRopaHealth(card) {
    const { dmg } = card;
    if (dmg === 0) {
        const div_element = document.querySelector('.ropa_card');
        const ropa_card = div_element.querySelector('.card_ludzie');
        const parent_div = div_element.parentNode;
        parent_div.insertBefore(ropa_card, div_element);
        div_element.remove();
        removeCard();
        return;
    }

    if (dmg === 3) {
        const ropa_card = document.querySelector('.card_ludzie[data-name="ROPA"]');
        const parent_div = ropa_card.parentNode;
        const div_element = document.createElement('div');
        parent_div.insertBefore(div_element, ropa_card);
        div_element.appendChild(ropa_card);
        div_element.style = 'position: relative';
        div_element.style.transform = ropa_card.style.transform;
        div_element.classList.add('ropa_card', 'disable');
        const hp_element = document.createElement('div');
        hp_element.dataset.max_hp = 4;
        hp_element.dataset.hp_name = "ROPA"
        ropa_card.style = '';
        div_element.appendChild(hp_element);
    }

    const ropa_card = document.querySelector('.card_ludzie[data-name="ROPA"]');
    const parent_div = ropa_card.parentNode;
    const hp_element = parent_div.querySelector('div[data-hp_name="ROPA"');
    hp_element.dataset.current_hp = dmg;
}