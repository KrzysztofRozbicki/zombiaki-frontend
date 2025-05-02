import { board, unsetField, moveSingleZombiak } from "../board.js";
import { removeCard } from "../index.js";

export function shot(card) {
    const { dmg } = card;
    for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const { element, card } = board[i][j];
            if (!card) continue;
            if (card.race !== 'zombiaki') continue;
            // change cursor / class to field available to shot
            element.classList.add('shot_available')

            //add handler on click
            const cards_on_field = element.querySelectorAll('.field > div');
            console.log(cards_on_field);
            cards_on_field.forEach(el => {
                const handler = shotHandler(dmg, board[i][j], el);

                el.shot_handler = handler;
                el.addEventListener('click', handler, { once: true });
            })
        }
    }
}

function shotHandler(dmg, field, specific_element) {
    return function () {
        const { element, card, card_overlay } = field;
        const { className } = specific_element
        if (className === 'overlay') card_overlay.hp -= dmg;
        if (className === 'field_image') {
            card.hp -= dmg;
            moveSingleZombiak(field, card, 'back');
        }

        const hp_element = specific_element.querySelector('div');
        hp_element.dataset.current_hp = +hp_element.dataset.current_hp - dmg;

        if (card.hp === 0) {
            killZombiak(field, specific_element);
        }

        //move card back if possible;
        for (let i = board.length - 1; i >= 0; i--) {
            for (let j = 0; j < board[i].length; j++) {
                const shot_element = board[i][j].element;

                shot_element.classList.remove('shot_available');
                const cards_on_field = shot_element.querySelectorAll('.field > div');
                cards_on_field.forEach(el => {
                    el.removeEventListener('click', el.shot_handler);
                    el.shot_handler = null;
                })
            }
        }

        removeCard();
    }
}


function killZombiak(field, specific_element) {
    const { className } = specific_element
    if (className === 'field_image') unsetField(field);

}


function addDamage(dmg, field) {

}