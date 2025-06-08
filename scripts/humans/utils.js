import {
    board,
    unsetField,
    moveSingleZombie,
    putCard,
    clearBoard,
    checkBlowField,
    moveAllzombiesBack,
    deadGalareta,
    deadSpecialZombieOneCard
} from "../board.js";
import {
    removeCard,
    getActiveCardszombies,
    setActiveCard,
    chosen_card,
    chosen_card_picture,
    close_card,
    play_card,
    closeCardHandler,
    removeCardzombies,
    deck_humans_element
} from "../index.js";
import { deleteOverlay, useBear } from "../zombies/utils.js";
import { disable, enable, show, hide, hideCancelButton, showAlert, addListener, removeListener } from "../utils.js";

export function shot(card, sniper = false, cegła = false) {
    disable(deck_humans_element);
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
            if (card?.race !== 'zombies' && card_board?.name !== 'AUTO' && !card_pet) continue;
            if (card?.name === 'KULOODPORNY' && name !== 'CEGŁA') {
                j++;
                continue;
            };
            let shot_krystynka = true;
            if (card?.name === 'KRYSTYNKA') {
                const przecznica = +element.dataset.przecznica - 1;
                const tor_krystynka = +element.dataset.tor - 1;
                for (let tor = 0; tor < board[przecznica].length; tor++) {
                    const field = board[przecznica][tor];
                    const { card, card_pet } = field;
                    if (tor === tor_krystynka) continue;
                    if (card?.type === 'zombie' || card_pet) {
                        shot_krystynka = false;
                        continue;
                    }
                }
            }
            if (!shot_krystynka) continue;


            element.classList.add('shot_available')
            const zombie_card_element = element.querySelector('.field_image') || element.querySelector('.field_board') || element.querySelector('.field_pet');
            let handler = shotHandler(dmg, board[i][j], zombie_card_element, piercing, cegła);
            zombie_card_element.shot_handler = handler;
            zombie_card_element.addEventListener('click', handler, { once: true });
            const bear_card_element = element.querySelector('div[data-name="MIŚ"]');
            if (bear_card_element) {
                handler = shotHandler(dmg, board[i][j], bear_card_element, piercing, cegła);
                bear_card_element.shot_handler = handler;
                bear_card_element.addEventListener('click', handler, { once: true });
            }

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
        await shotZombie(dmg, field, specific_element, piercing, cegła)
    }
}

async function shotZombie(dmg, field, specific_element, piercing, cegła = false) {
    clearShotElements();
    removeCard();
    enable(deck_humans_element);
    let damage = dmg;
    const human_card = field?.overlay_cards?.find(card => card.name === 'CZŁOWIEK');
    const pazury_card = field?.overlay_cards?.find(card => card.name === 'PAZURY') || null;
    const galareta_card = field?.overlay_cards?.find(card => card.name === 'GALARETA') || null;



    if (human_card) {
        deleteOverlay(field, human_card.id);
        return
    }

    if (!cegła) {
        const clickPlayed = await checkClick();
        if (clickPlayed) return;
    }
    const { element, card, overlay_cards, card_pet } = field;
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
                if (card.type === 'zombie') {
                    const zombie_card = element.querySelector('.field_image');
                    // setTimeout(() => shotZombie(piercing_dmg, field, zombie_card, piercing), 2000);
                    shotZombie(piercing_dmg, field, zombie_card, piercing)
                    return;
                }
            }
        }
    }

    if ((className === 'overlay' || className === 'field_image') && field.card.name !== 'MASA') {
        const hp_element = specific_element.querySelector('.hp_element');
        hp_element.dataset.current_hp = +hp_element.dataset.current_hp - damage;
        if (hp_element.dataset.current_hp < 0) hp_element.dataset.current_hp = 0;
    }

    if (field?.card?.name === 'MASA') {
        const hp_element = specific_element.querySelector('.hp_masa__text');
        hp_element.innerText = +hp_element.innerText - damage;
        if (+hp_element.innerText < 0) hp_element.innerText = '0';
    }

    if (className === 'overlay') {
        const index_bear = field.overlay_cards.findIndex(card => card.name === 'MIŚ');
        overlay_cards[index_bear].hp -= dmg;
    }

    if (className === 'field_image') {
        card.hp -= damage;

        if (pazury_card) deleteOverlay(field, pazury_card.id);
        if (galareta_card && card.max_hp >= card.hp) deleteOverlay(field, galareta_card.id);
        if (card.hp <= 0) {
            killZombie(field);
            if (card.hp < 0 && piercing) {
                const piercing_dmg = card.hp * -1;
                const tor = +element.dataset.tor - 1;
                const przecznica = +element.dataset.przecznica - 1;
                for (let i = przecznica - 1; i >= 0; i--) {
                    const field = board[i][tor];
                    const { element, card } = field;
                    if (!card) continue;
                    if (card.mur) return;
                    if (card.type === 'zombie') {
                        const zombie_card = element.querySelector('.field_image');
                        shotZombie(piercing_dmg, field, zombie_card, piercing)
                        return;
                    }
                }
            }
            return;
        }
        if (!cegła) moveSingleZombie(field, card, 'back');
        const is_dziura = field?.card_board?.name === 'DZIURA';
        if (card.hp <= 2 && !cegła && is_dziura) {
            const tor = +element.dataset.tor - 1;
            const przecznica = +element.dataset.przecznica - 1;
            const back_field_taken = board[przecznica - 1][tor]?.card?.type === 'zombie';
            if (is_dziura && back_field_taken) {
                unsetField(field, { board_card: true });
                killZombie(field);
                return;
            }
        }
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
                    if (card.type === 'zombie') {
                        const zombie_card = element.querySelector('.field_image');
                        // setTimeout(() => shotZombie(piercing_dmg, field, zombie_card, piercing), 2100);
                        shotZombie(piercing_dmg, field, zombie_card, piercing);
                        return;
                    }
                }
            }
        }
        return;
    }
    let bear_card = null;
    if (overlay_cards && overlay_cards.length > 0) bear_card = field.overlay_cards.find(card => card.name === 'MIŚ');
    if (bear_card && bear_card.hp <= 0) {
        if (bear_card.hp < 0) {
            const piercing_dmg = bear_card.hp * -1;
            const zombie_card = element.querySelector('.field_image');
            shotZombie(piercing_dmg, field, zombie_card, piercing)
        }
        deleteOverlay(field, bear_card.id);
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

export function killZombie(field) {
    const { card, overlay_cards, element } = field;
    const images = element.querySelectorAll('.field > .field_image');
    const pet_images = element.querySelectorAll('.field > .field_pet');
    pet_images.forEach(image => image.classList.add('death_animation'));
    images.forEach(image => image.classList.add('death_animation'));
    clearBoard();
    disable(document.body);
    let is_boss = false;
    let is_bear = false;

    if (overlay_cards && overlay_cards.length > 0) {
        is_boss = !!overlay_cards.find(card => card.name === 'BOSS');
        is_bear = !!overlay_cards.find(card => card.name === 'MIŚ');
    }

    setTimeout(() => {
        enable(document.body);

        if ((card?.name === 'SYJAMCZYK' || card?.name === 'KOŃ TROJAŃSKI') && is_bear) {
            unsetField(field, { bear: true })
        } else {
            unsetField(field)
        }

        if (card?.name === 'KOŃ TROJAŃSKI') deadSpecialZombieOneCard(field, 3);
        if (card?.name === 'SYJAMCZYK') deadSpecialZombieOneCard(field, 2);

        if (is_boss) {
            showAlert('BOSS ZGINĄŁ! zombies W PRZESTRACHU COFAJĄ SIĘ!');
            moveAllzombiesBack();
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

export function damageZombie(dmg, field) {
    const { element, card, card_pet } = field;
    let damage = dmg;
    const human_card = field?.overlay_cards?.find(card => card.name === 'CZŁOWIEK') || null;
    const pazury_card = field?.overlay_cards?.find(card => card.name === 'PAZURY') || null;
    const galareta_card = field?.overlay_cards?.find(card => card.name === 'GALARETA') || null;
    const concrete_shoes_card = field?.overlay_cards?.find(card => card.name === 'BETONOWE BUCIKI') || null;
    if (human_card && !concrete_shoes_card) {
        deleteOverlay(field, human_card.id);
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
        if (pazury_card) deleteOverlay(field, pazury_card.id);
        if (galareta_card && card.max_hp >= card.hp) deleteOverlay(field, galareta_card.id);
        if (card.hp <= 2) {
            const is_dziura = field?.card_board?.name === 'DZIURA';
            if (is_dziura) {
                unsetField(field, { board_card: true });
                killZombie(field);
                return;
            }
        }
        if (card.name === 'MASA') {
            const hp_element = element.querySelector('.hp_masa__text');
            hp_element.innerText = +hp_element.innerText - damage;
            if (+hp_element.innerText < 0) hp_element.innerText = '0';
        } else {
            const hp_element = element.querySelector('.field_image > .hp_element');
            hp_element.dataset.current_hp = card.hp;
        }
        if (card.hp <= 0) killZombie(field);
    }
}

function checkClick() {
    const click_card = getActiveCardszombies().find(card => card.name === 'KLIK');
    if (!click_card) { return Promise.resolve(false) };

    return new Promise((resolve) => {
        setActiveCard(click_card);
        chosen_card_picture.src = `images/cards/zombies/${click_card.id}.webp`;
        show(chosen_card);
        addListener(close_card, closeCardHandler(), { once: true });
        const close_handler = closeCardClickHandler(resolve);
        close_card.click_handler = close_handler;
        close_card.addEventListener('click', close_handler, { once: true });
        hide(play_card);
        const play_other = document.getElementById('play_other');
        play_other.innerText = 'ZAGRAJ KLIK';
        const button_box = chosen_card.querySelector('.card_buttons_box');
        show(button_box);
        addListener(play_other, handlePlayClick(resolve), { once: true });
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
        removeCardzombies(id);
        if (card_to_remove) {
            card_to_remove.src = `images/cards/zombies/rewers.webp`;
            card_to_remove.classList.add('card_blank');
            card_to_remove.dataset.id = 'blank';
            card_to_remove.dataset.name = 'blank';
            removeListener(card_to_remove);
        }
        removeListener(close_card);
        hide(chosen_card);
        resolve(true);
    }
}

function closeCardClickHandler(resolve) {
    return function () {
        const play_other = document.getElementById('play_other');
        removeListener(play_other);
        resolve(false);
        hide(play_other);
        show(play_card);
        play_other.innerText = '';
    }
}

export function placeMur(card) {
    disable(deck_humans_element);
    let zombie_tor = null;
    for (let i = board.length - 1; i >= 1; i--) {
        for (let j = 0; j < board[i].length; j++) {
            const field = board[i][j];

            if (field.card || field.card_pet) {
                zombie_tor = j;
                continue;
            }

            const neighbour_field_is_taken = neighbourFieldIsTaken(i, j);
            if (neighbour_field_is_taken) continue;
            if (field.card_board) continue;
            if (j === zombie_tor) continue;

            putCard(field, card);
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
        const field_is_taken = !!(board[p][t].card && board[p][t].card.type === "zombie");
        if (field_is_taken) return true;
    }
    return false;
}


export function aoeHandler(field, card, is_krystynka = false) {
    return function (event) {
        activeAoe(field, card, is_krystynka, event);
    }
}
function activeAoe(field, card, is_krystynka = false, event) {
    const is_auto = event.target.dataset.name === 'AUTO';
    const is_mina = event.target.dataset.name === 'MINA';
    const is_bear = event.target.parentNode.dataset.name === 'MIŚ';

    hideCancelButton();
    const targetCard = field.card || field.card_pet;
    card.dmg -= 1;
    setAoeCardHealth(card)
    clearBoard();
    if (is_auto || is_mina) checkBlowField(field);
    if (targetCard && targetCard.type === 'zombie' && !is_auto && !is_bear) damageZombie(1, field);
    if (is_bear) useBear(field);
    if (card.dmg === 0) return;
    if (targetCard?.hp === 0) {
        setTimeout(() => {
            setAoeBoard(field, card, is_krystynka);
        }, 1600)
        return
    }
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
            if (card?.type === 'zombie' || card_pet) {
                burn_krystynka = false;
                continue;
            }
        }
        const krystynka_index = all_fields.findIndex(field => field?.card?.name === 'KRYSTYNKA');
        if (!burn_krystynka && krystynka_index !== -1) {
            all_fields.splice(krystynka_index, 1);
        }
    }


    all_fields.forEach((field) => {
        const { element } = field;
        element.classList.add(`${name.toLowerCase()}_available`);
        addListener(element, aoeHandler(field, card, is_krystynka));
    })
}

function setAoeCardHealth(card) {
    const { dmg, max_dmg, name } = card;
    if (dmg === 0) {
        const div_element = document.querySelector('.hp_card');
        const hp_card = div_element.querySelector('.card_humans');
        const parent_div = div_element.parentNode;
        parent_div.insertBefore(hp_card, div_element);
        div_element.remove();
        enable(deck_humans_element);
        removeCard();
        return;
    }

    if (dmg === max_dmg - 1) {
        const hp_card = document.querySelector(`.card_humans[data-name="${name}"]`);
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

    const hp_card = document.querySelector(`.card_humans[data-name="${name}"]`);
    const parent_div = hp_card.parentNode;
    const hp_element = parent_div.querySelector(`div[data-hp_name="${name}"`);
    hp_element.dataset.current_hp = dmg;
}