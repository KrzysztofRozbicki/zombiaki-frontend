//SIEĆ
import { board } from './../board.js';
import { hideCancelButton, enable, disable } from '../utils.js';
import { removeCard, deck_ludzie_element } from '../index.js';
export default function ludzie_id_8(card, field) {
    web(card);
}


let MAX_STRENGTH = 6;
function web(card) {
    disable(deck_ludzie_element);
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[0].length; j++) {
            const field = board[i][j];
            const { element, card } = field;
            if (!card || card.race !== 'zombiaki') continue;
            if (card.hp > MAX_STRENGTH) continue;
            element.classList.add('web_available');

            const handler = webHandler(field, card)
            element.addEventListener('click', handler, { once: true });
            element.handler = handler;
        }
    }
}


function webHandler(field, webCard) {
    return function () {
        hideCancelButton();
        removeCard(webCard);
        const { element, card } = field;
        MAX_STRENGTH -= card.hp;
        if (MAX_STRENGTH < 0) return;
        element.classList.add('webbed')
        const all_web_elements = document.querySelectorAll('.web_available');
        all_web_elements.forEach((element) => {
            element.classList.remove('web_available');
            element.removeEventListener('click', element.handler);
            element.handler = null;
        })
        setWebBoard(field, webCard)
    }
}


function setWebBoard(field, card) {
    const { element } = field;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;

    const cross = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    const all_fields = [];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        all_fields.push(board[p][t]);
    }

    all_fields.forEach((field) => {
        const { element } = field;
        element.classList.add('web_available');
    })
}