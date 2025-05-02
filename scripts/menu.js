import { cards_ludzie, cards_zombiaki } from "./index.js";
import { show, hide, showAll, hideAll } from "./utils.js";

const reset_button = document.getElementById('reset');
const intro = document.getElementById('intro');
const board_element = document.getElementById('board');
const menu_element = document.getElementById('menu');
const choose_race = document.getElementById('choose-race');


export function initMenu(race) {
    hideAll([intro, choose_race]);
    showAll([board_element, menu_element]);
    reset_button.addEventListener('click', () => {
        window.location.reload();
    })
    chooseRace(race);
}

export function chooseRace(race) {
    const end_turn_ludzie = document.getElementById('rewers_stack_ludzie');
    const end_turn_zombiaki = document.getElementById('rewers_stack_zombiaki');
    const stack_ludzie = end_turn_ludzie.querySelectorAll('.stack');
    const stack_zombiaki = end_turn_zombiaki.querySelectorAll('.stack');
    const whole_stack = [...stack_ludzie, ...stack_zombiaki];
    for (let i = 0; i < whole_stack.length; i++) {
        const degrees = Math.floor(Math.random() * (10 - -10) + -10);
        whole_stack[i].style = `transform:rotate(${degrees}deg);`
    }

    if (race === 'ludzie') {
        hide(end_turn_zombiaki);
        show(end_turn_ludzie);
        cards_ludzie.forEach(card =>
            card.dataset.playable = true
        )
        cards_zombiaki.forEach(card =>
            card.dataset.playable = false
        )
    }

    if (race === 'zombiaki') {
        hide(end_turn_ludzie);
        show(end_turn_zombiaki);
        cards_zombiaki.forEach(card =>
            card.dataset.playable = true
        )
        cards_ludzie.forEach(card =>
            card.dataset.playable = false
        )
    }
}