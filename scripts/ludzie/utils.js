import { board, unsetField, moveSingleZombiak } from "../board.js";
import {
    removeCard,
    getActiveCardsZombiaki,
    setActiveCard,
    chosen_card,
    chosen_card_picture,
    close_card,
    play_card,
    closeCardHandler,
    removeCardZombiaki,
    deck_ludzie_element
} from "../index.js";
import { deleteOverlay } from "../zombiaki/utils.js";
import { disable, enable, show, hide } from "../utils.js";

export function shot(card, sniper = false, cegła = false) {
    disable(deck_ludzie_element);
    const { dmg, piercing } = card;
    for (let j = 0; j < board[0].length; j++) {
        for (let i = board.length - 1; i >= 0; i--) {
            const { element, card } = board[i][j];
            if (!card) continue;
            if (card.mur && !sniper) {
                for (let k = i - 1; k >= 0; k--) {
                    disable(board[k][j].element);
                }

                j++;
                i = board.length;
                continue;
            }
            if (card.race !== 'zombiaki') continue;
            element.classList.add('shot_available')

            const cards_on_field = element.querySelectorAll('.field > div');
            cards_on_field.forEach(el => {
                const handler = shotHandler(dmg, board[i][j], el, piercing, cegła);

                el.shot_handler = handler;
                el.addEventListener('click', handler, { once: true });
            })
            if (i !== 0 && !sniper) {
                j++;
                i = board.length;
            }
        }
    }
}

function shotHandler(dmg, field, specific_element, piercing, cegła) {
    return async function () {
        await shotZombiak(dmg, field, specific_element, piercing, cegła)
    }
}

async function shotZombiak(dmg, field, specific_element, piercing, cegła = false) {
    clearShotElements();
    removeCard();
    enable(deck_ludzie_element);
    if (!cegła) {
        const clickPlayed = await checkClick();
        if (clickPlayed) return;
    }
    const { element, card, card_overlay } = field;
    const { className } = specific_element;
    const hp_element = specific_element.querySelector('div');
    hp_element.dataset.current_hp = +hp_element.dataset.current_hp - dmg;
    if (hp_element.dataset.current_hp < 0) hp_element.dataset.current_hp = 0;


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
                        setTimeout(() => shotZombiak(piercing_dmg, field, zombie_card, piercing), 2100);
                        return;
                    }
                }
            }
            return;
        }
        if (!cegła) moveSingleZombiak(field, card, 'back');
    }

    if (card_overlay && card_overlay.hp <= 0) {
        if (card_overlay.hp < 0) {
            const piercing_dmg = card_overlay.hp * -1;
            const zombie_card = element.querySelector('.field_image');
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

export function damageZombiak(dmg, field) {
    const { element, card } = field;
    card.hp -= dmg;
    if (card.hp <= 0) killZombiak(field);
    const zombiak_element = element.querySelector('.field_image > div');
    zombiak_element.dataset.current_hp = card.hp;
}

function checkClick() {
    const click_card = getActiveCardsZombiaki().find(card => card.name === 'KLIK');
    if (!click_card) { return Promise.resolve(false) };

    return new Promise((resolve) => {
        setActiveCard(click_card);
        chosen_card_picture.src = `images/cards/zombiaki/${click_card.id}.webp`;
        show(chosen_card);
        const handler = closeCardHandler();
        close_card.handler = handler;
        close_card.addEventListener('click', handler, { once: true });

        const close_handler = closeCardClickHandler(resolve);
        close_card.click_handler = close_handler;
        close_card.addEventListener('click', close_handler, { once: true });

        hide(play_card);
        const play_other = document.getElementById('play_other');
        play_other.innerText = 'ZAGRAJ KLIK';
        const click_handler = handlePlayClick(resolve);
        play_other.handler = click_handler;
        play_other.addEventListener('click', click_handler, { once: true });
        show(play_other);
    })
}


function handlePlayClick(resolve) {
    return function () {
        const play_other = document.getElementById('play_other');
        close_card.removeEventListener('click', close_card.click_handler);
        close_card.click_handler = null;
        hide(play_other);
        show(play_card);
        play_other.innerText = '';

        const card_to_remove = document.querySelector(`img[data-name="KLIK"]`);
        const id = card_to_remove.dataset.id;
        removeCardZombiaki(id);
        if (card_to_remove) {
            card_to_remove.src = `images/cards/zombiaki/rewers.webp`;
            card_to_remove.classList.add('card_blank');
            card_to_remove.dataset.id = 'blank';
            card_to_remove.dataset.name = 'blank';
            card_to_remove.removeEventListener('click', card_to_remove.handler);
            card_to_remove.handler = null;
        }
        close_card.removeEventListener('click', close_card.handler);
        close_card.handler = null;
        hide(chosen_card);
        resolve(true);
    }
}

function closeCardClickHandler(resolve) {
    return function () {
        const play_other = document.getElementById('play_other');
        play_other.removeEventListener('click', play_other.handler);
        play_other.handler = null;
        resolve(false);
        hide(play_other);
        show(play_card);
        play_other.innerText = '';
    }
}