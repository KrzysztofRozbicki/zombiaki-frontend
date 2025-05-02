import { board, unsetField, moveSingleZombiak } from "../board.js";
import { removeCard } from "../index.js";
import { deleteOverlay } from "../zombiaki/utils.js";

export function shot(card) {
    const { dmg, piercing } = card;
    console.log('piercing: ', piercing);
    for (let j = 0; j < board[0].length; j++) {
        for (let i = board.length - 1; i >= 0; i--) {
            const { element, card } = board[i][j];
            if (!card) continue;
            if (card.mur) {
                j++;
                i = board.length - 1;
                continue;
            }
            if (card.race !== 'zombiaki') continue;
            element.classList.add('shot_available')

            const cards_on_field = element.querySelectorAll('.field > div');
            console.log(cards_on_field);
            cards_on_field.forEach(el => {
                const handler = shotHandler(dmg, board[i][j], el, piercing);

                el.shot_handler = handler;
                el.addEventListener('click', handler, { once: true });
            })
            j++;
        }
    }
}

function shotHandler(dmg, field, specific_element, piercing) {
    return function () {
        shotZombiak(dmg, field, specific_element, piercing)
    }
}

function shotZombiak(dmg, field, specific_element, piercing) {
    console.log('piercing :', piercing);
    clearShotElements();
    const { element, card, card_overlay } = field;
    const { className } = specific_element
    const hp_element = specific_element.querySelector('div');
    hp_element.dataset.current_hp = +hp_element.dataset.current_hp - dmg;
    if (hp_element.dataset.current_hp < 0) hp_element.dataset.current_hp = 0;
    removeCard();

    if (className === 'overlay') card_overlay.hp -= dmg;
    if (className === 'field_image') {
        card.hp -= dmg;
        if (card.hp <= 0) {
            killZombiak(field);
            if (card.hp < 0 && piercing) {
                const piercing_dmg = card.hp * -1;
                const tor = +element.dataset.tor - 1;
                const przecznica = +element.dataset.przecznica - 1;
                for (let i = przecznica - 1; i >= 0; i--) {
                    const field = board[i][tor];
                    const { element, card } = field;
                    if (!card) continue;
                    if (card.mur) return;
                    if (card.type === 'zombiak') {
                        const zombie_card = element.querySelector('.field_image');
                        console.log(zombie_card);
                        setTimeout(() => shotZombiak(piercing_dmg, field, zombie_card, piercing), 2100);
                        return;
                    }
                }
            }
            return;
        }
        moveSingleZombiak(field, card, 'back');
    }

    if (card_overlay && card_overlay.hp <= 0) {
        if (card_overlay.hp < 0) {
            const piercing_dmg = card_overlay.hp * -1;
            const zombie_card = element.querySelector('.field_image');
            console.log(zombie_card);
            shotZombiak(piercing_dmg, field, zombie_card, piercing)
        }
        deleteOverlay(field);
    }
}

function clearShotElements() {

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

}

function killZombiak(field) {
    const { element } = field;
    const images = element.querySelectorAll('.field > div')
    images.forEach(image => image.classList.add('death_animation'));

    setTimeout(() => unsetField(field), 2000);

}


function addDamage(dmg, field) {

}