import { cards_humans, cards_zombies } from "./index.js";
import { show, hide, showAll, hideAll, randomRotate } from "./utils.js";
const intro = document.getElementById('intro');
const board_element = document.getElementById('board');
const menu_element = document.getElementById('menu');
const choose_race = document.getElementById('choose-race');

const end_turn_humans = document.getElementById('rewers_stack_humans');
const end_turn_zombies = document.getElementById('rewers_stack_zombies');


export function initMenu(race) {
    document.body.classList.add('background')
    hideAll([intro, choose_race]);
    showAll([board_element, menu_element]);
    randomRotateDeck()
    chooseRace(race);
}

function randomRotateDeck() {

    const stack_humans = end_turn_humans.querySelectorAll('.stack');
    const stack_zombies = end_turn_zombies.querySelectorAll('.stack');
    const whole_stack = [...stack_humans, ...stack_zombies];

    whole_stack.forEach(el => randomRotate(15, el));

}

export function chooseRace(race) {

    const oppositeRace = race === 'humans' ? 'zombies' : 'humans';

    hide(document.getElementById(`rewers_stack_${oppositeRace}`))
    show(document.getElementById(`rewers_stack_${race}`));
    cards_humans.forEach(card =>
        card.dataset.playable = (race === 'humans')
    );
    cards_zombies.forEach(card =>
        card.dataset.playable = (race === 'zombies')
    );
}