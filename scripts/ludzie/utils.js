import {
    board,
    unsetField,
    moveSingleZombiak,
    putCard,
    clearBoard,
    checkBlowField,
    moveAllZombiakiBack,
    deadGalareta,
    deadSpecialZombiakOneCard
} from "../board.js";
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
import { disable, enable, show, hide, hideCancelButton, showAlert } from "../utils.js";

export function shot(card, sniper = false, cegła = false) {
    disable(deck_ludzie_element);
    const { dmg, piercing, name } = card;
    for (let j = 0; j < board[0].length; j++) {
        for (let i = board.length - 1; i >= 0; i--) {
            const { element, card, card_board, card_pet } = board[i][j];
            if (!card && !card_board && !card_pet) continue;
            if (card_board?.mur && !sniper) {
                for (let k = i - 1; k >= 0; k--) {
                    disable(board[k][j].element);
                }

                j++;
                if (j >= board[0].length) return;
                i = board.length;
                continue;
            }
            if (card?.race !== 'zombiaki' && card_board?.name !== 'AUTO' && !card_pet) continue;
            if (card?.name === 'KULOODPORNY' && name !== 'CEGŁA') continue;
            let shot_krystynka = true;
            if (card?.name === 'KRYSTYNKA') {
                const przecznica = +element.dataset.przecznica - 1;
                const tor_krystynka = +element.dataset.tor - 1;
                for (let tor = 0; tor < board[przecznica].length; tor++) {
                    const field = board[przecznica][tor];
                    const { card, card_pet } = field;
                    if (tor === tor_krystynka) continue;
                    if (card?.type === 'zombiak' || card_pet) {
                        shot_krystynka = false;
                        continue;
                    }
                }
            }
            if (!shot_krystynka) continue;


            element.classList.add('shot_available')
            const cards_on_field = element.querySelectorAll('.field > div');
            cards_on_field.forEach(el => {
                const handler = shotHandler(dmg, board[i][j], el, piercing, cegła);

                el.shot_handler = handler;
                el.addEventListener('click', handler, { once: true });
            })
            if (i !== 0 && !sniper) {
                j++;
                if (j >= board[0].length) return;
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
    let damage = dmg;

    if (field?.card_overlay?.name === "CZŁOWIEK") {
        deleteOverlay(field);
        return
    }

    if (!cegła) {
        const clickPlayed = await checkClick();
        if (clickPlayed) return;
    }
    const { element, card, card_overlay, card_pet } = field;
    const { className } = specific_element;

    if (card_pet) {
        damage = dmg - card_pet.hp;
        card_pet.hp -= dmg;
        if (card_pet.hp <= 0) killPet(field);
        const pet_element = element.querySelector('.field_pet > div');
        pet_element.dataset.current_hp = card_pet.hp;

        if (card_pet.hp < 0 && piercing) {
            const piercing_dmg = card_pet.hp * -1;
            const tor = +element.dataset.tor - 1;
            const przecznica = +element.dataset.przecznica - 1;
            for (let i = przecznica - 1; i >= 0; i--) {
                const field = board[i][tor];
                const { element, card } = field;
                if (card?.mur) return;
                if (!card) continue;
                if (card.type === 'zombiak') {
                    const zombie_card = element.querySelector('.field_image');
                    setTimeout(() => shotZombiak(piercing_dmg, field, zombie_card, piercing), 2000);
                    return;
                }
            }
        }

    }

    if (className === 'overlay' || className === 'field_image') {
        const hp_element = specific_element.querySelector('div');
        hp_element.dataset.current_hp = +hp_element.dataset.current_hp - damage;
        if (hp_element.dataset.current_hp < 0) hp_element.dataset.current_hp = 0;
    }

    if (className === 'overlay') card_overlay.hp -= dmg;
    if (className === 'field_image') {

        card.hp -= damage;
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
                        setTimeout(() => shotZombiak(piercing_dmg, field, zombie_card, piercing), 2000);
                        return;
                    }
                }
            }
            return;
        }
        if (!cegła) moveSingleZombiak(field, card, 'back');
    }

    if (className === 'field_board') {
        if (field.card_board.name === 'AUTO') {
            checkBlowField(field);
            if (damage > 1 && piercing) {
                const piercing_dmg = damage - 1;
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
        }
        return;
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

export function killZombiak(field) {
    const { card, card_overlay, element } = field;
    const images = element.querySelectorAll('.field > .field_image');
    const pet_images = element.querySelectorAll('.field > .field_pet');
    pet_images.forEach(image => image.classList.add('death_animation'));
    images.forEach(image => image.classList.add('death_animation'));
    clearBoard();
    disable(document.getElementById('streets'));
    setTimeout(() => {
        unsetField(field)
        enable(document.getElementById('streets'));
        if (card?.name === 'KOŃ TROJAŃSKI') deadSpecialZombiakOneCard(field, 3);
        if (card?.name === 'SYJAMCZYK') deadSpecialZombiakOneCard(field, 2);
        if (card_overlay?.name === 'BOSS') {
            showAlert('BOSS ZGINĄŁ! ZOMBIAKI W PRZESTRACHU COFAJĄ SIĘ!');
            moveAllZombiakiBack();
        }
        if (card?.name === 'GALARETA') deadGalareta(field);
    }, 1500);
}

export function killPet(field) {
    const { element } = field;
    const pet_image = element.querySelector('.field_pet');
    pet_image.classList.add('death_animation');
    field.card_pet = null;
    clearBoard();
    setTimeout(() => pet_image.remove(), 1000);
    return;
}

export function damageZombiak(dmg, field) {
    const { element, card, card_pet } = field;
    let damage = dmg;
    if (field?.card_overlay?.name === "CZŁOWIEK") {
        deleteOverlay(field);
        return;
    }

    if (card_pet) {
        damage = dmg - card_pet.hp;
        card_pet.hp -= dmg;
        if (card_pet.hp <= 0) killPet(field);
        const pet_element = element.querySelector('.field_pet > .hp_element');
        pet_element.dataset.current_hp = card_pet.hp;
    }
    if (card) {
        card.hp -= damage;
        const zombiak_element = element.querySelector('.field_image > .hp_element');
        zombiak_element.dataset.current_hp = card.hp;
        if (card.hp <= 0) killZombiak(field);
    }
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

export function placeMur(card) {
    disable(deck_ludzie_element);
    for (let i = 1; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const neighbour_field_is_taken = neighbourFieldIsTaken(i, j);
            if (neighbour_field_is_taken) continue;
            if (board[i][j].card_board) continue;
            putCard(board[i][j], card);
        }
    }
}

function neighbourFieldIsTaken(i, j) {
    const cross = [[0, 0], [1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1], [-1, 0], [1, 0]];
    for (let k = 0; k < cross.length; k++) {
        let t = j + cross[k][0];
        let p = i + cross[k][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        const field_is_taken = !!(board[p][t].card && board[p][t].card.type === "zombiak");
        if (field_is_taken) return true;
    }
    return false;
}


export function aoeHandler(field, card, is_krystynka = false) {
    return function () {
        activeAoe(field, card, is_krystynka);
    }
}
function activeAoe(field, card, is_krystynka = false) {
    const { element } = field;
    hideCancelButton();
    const targetCard = field.card || field.card_pet;
    card.dmg -= 1;
    setAoeCardHealth(card)
    clearBoard();
    checkBlowField(field);
    if (targetCard && targetCard.type === 'zombiak') damageZombiak(1, field);
    if (card.dmg === 0) return;
    setAoeBoard(field, card, is_krystynka);
}

function setAoeBoard(field, card, is_krystynka = false) {
    const { element } = field;
    const { name } = card;

    const tor = +element.dataset.tor - 1;
    const przecznica = +element.dataset.przecznica - 1;
    let cross = [];
    if (name === 'ROPA') cross = [[1, 0], [-1, 0], [0, -1], [0, 1]];
    if (name === 'MIOTACZ') cross = [[1, 0], [-1, 0]];
    const all_fields = [board[przecznica][tor]];

    for (let i = 0; i < cross.length; i++) {
        let t = tor + cross[i][0];
        let p = przecznica + cross[i][1];
        if (t < 0 || t > 2) continue;
        if (p < 0 || p > 4) continue;
        all_fields.push(board[p][t]);
    }

    if (name === 'MIOTACZ' && is_krystynka) {
        let burn_krystynka = true;

        for (let t = 0; t < board[przecznica].length; t++) {
            const field = board[przecznica][t];
            const { card, card_pet } = field;
            if (card?.name === 'KRYSTYNKA') continue;
            if (card?.type === 'zombiak' || card_pet) {
                burn_krystynka = false;
                continue;
            }
        }
        const krystynka_index = all_fields.findIndex(field => field?.card?.name === 'KRYSTYNKA');
        console.log(krystynka_index);
        if (!burn_krystynka && krystynka_index !== -1) {
            all_fields.splice(krystynka_index, 1);
        }

    }


    all_fields.forEach((field) => {
        const { element } = field;
        element.classList.add(`${name.toLowerCase()}_available`);

        const handler = aoeHandler(field, card, is_krystynka);
        element.addEventListener('click', handler);
        element.handler = handler;
    })
}

function setAoeCardHealth(card) {
    const { dmg, max_dmg, name } = card;
    if (dmg === 0) {
        const div_element = document.querySelector('.hp_card');
        const hp_card = div_element.querySelector('.card_ludzie');
        const parent_div = div_element.parentNode;
        parent_div.insertBefore(hp_card, div_element);
        div_element.remove();
        enable(deck_ludzie_element);
        removeCard();
        return;
    }

    if (dmg === max_dmg - 1) {
        const hp_card = document.querySelector(`.card_ludzie[data-name="${name}"]`);
        const parent_div = hp_card.parentNode;
        const div_element = document.createElement('div');
        parent_div.insertBefore(div_element, hp_card);
        div_element.appendChild(hp_card);
        div_element.style = 'position: relative';
        div_element.style.transform = hp_card.style.transform;
        div_element.classList.add('hp_card', 'disable');
        const hp_element = document.createElement('div');
        hp_element.dataset.max_hp = 4;
        hp_element.dataset.hp_name = name
        hp_card.style = '';
        div_element.appendChild(hp_element);
        hp_element.classList.add('hp_element');
    }

    const hp_card = document.querySelector(`.card_ludzie[data-name="${name}"]`);
    const parent_div = hp_card.parentNode;
    const hp_element = parent_div.querySelector(`div[data-hp_name="${name}"`);
    hp_element.dataset.current_hp = dmg;
}