import { cards_ludzie, cards_zombiaki } from "./index.js";
import { show, hide, showAll, hideAll, randomRotate } from "./utils.js";
const intro = document.getElementById('intro');
const board_element = document.getElementById('board');
const menu_element = document.getElementById('menu');
const choose_race = document.getElementById('choose-race');

const end_turn_ludzie = document.getElementById('rewers_stack_ludzie');
const end_turn_zombiaki = document.getElementById('rewers_stack_zombiaki');


export function initMenu(race) {
    document.body.classList.add('background')
    hideAll([intro, choose_race]);
    showAll([board_element, menu_element]);
    randomRotateDeck()
    chooseRace(race);
}

function randomRotateDeck() {

    const stack_ludzie = end_turn_ludzie.querySelectorAll('.stack');
    const stack_zombiaki = end_turn_zombiaki.querySelectorAll('.stack');
    const whole_stack = [...stack_ludzie, ...stack_zombiaki];

    whole_stack.forEach(el => randomRotate(15, el));

}

export function chooseRace(race) {

    const oppositeRace = race === 'ludzie' ? 'zombiaki' : 'ludzie';

    hide(document.getElementById(`rewers_stack_${oppositeRace}`))
    show(document.getElementById(`rewers_stack_${race}`));
    cards_ludzie.forEach(card =>
        card.dataset.playable = (race === 'ludzie')
    );
    cards_zombiaki.forEach(card =>
        card.dataset.playable = (race === 'zombiaki')
    );
}