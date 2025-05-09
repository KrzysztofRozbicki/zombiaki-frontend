//MIOTACZ
import { board, clearBoard } from '../board.js';
import { hideCancelButton, enable, disable } from '../utils.js';
import { removeCard, deck_ludzie_element } from '../index.js';
import { damageZombiak } from "./utils.js";

export default function ludzie_id_24(card, field) {
    miotacz(card);
}

function miotacz(card) {
    disable(deck_ludzie_element);
    const przecznica = checkPrzecznica();
    for (let i = 0; i < board[przecznica].length; i++) {
        const field = board[przecznica][i];
        const { element } = field;
        element.classList.add('miotacz_available');
        const handler = miotaczHandler(field, card);
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

function miotaczHandler(field, card) {
    return function () {
        activeMiotacz(field, card);
    }
}


function activeMiotacz(field, card) {
    hideCancelButton();
    const targetCard = field.card;
    card.dmg -= 1;
    setMiotaczHealth(card)
    clearBoard();

    if (targetCard && targetCard.type === 'zombiak') damageZombiak(1, field);
    if (card.dmg === 0) return;
    setMiotaczBoard(field, card);
}

function setMiotaczBoard(field, card) {
    const { element } = field;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[1, 0], [-1, 0]];
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
        element.classList.add('miotacz_available');

        const handler = miotaczHandler(field, card);
        element.addEventListener('click', handler);
        element.handler = handler;
    })
}

function setMiotaczHealth(card) {
    const { dmg } = card;
    if (dmg === 0) {
        const div_element = document.querySelector('.hp_card');
        const hp_card = div_element.querySelector('.card_ludzie');
        const parent_div = div_element.parentNode;
        parent_div.insertBefore(hp_card, div_element);
        div_element.remove();
        removeCard();
        return;
    }

    if (dmg === 4) {
        const hp_card = document.querySelector('.card_ludzie[data-name="MIOTACZ"]');
        const parent_div = hp_card.parentNode;
        const div_element = document.createElement('div');
        parent_div.insertBefore(div_element, hp_card);
        div_element.appendChild(hp_card);
        div_element.style = 'position: relative';
        div_element.style.transform = hp_card.style.transform;
        div_element.classList.add('hp_card', 'disable');
        const hp_element = document.createElement('div');
        hp_element.dataset.max_hp = 5;
        hp_element.dataset.hp_name = "MIOTACZ"
        hp_card.style = '';
        div_element.appendChild(hp_element);
    }

    const hp_card = document.querySelector('.card_ludzie[data-name="MIOTACZ"]');
    const parent_div = hp_card.parentNode;
    const hp_element = parent_div.querySelector('div[data-hp_name="MIOTACZ"');
    hp_element.dataset.current_hp = dmg;
}