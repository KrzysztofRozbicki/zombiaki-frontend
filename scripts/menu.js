const reset_button = document.getElementById('reset');
const intro = document.getElementById('intro');
const board_element = document.getElementById('board');
const menu_element = document.getElementById('menu');
const choose_race = document.getElementById('choose-race');
import { cards_ludzie, cards_zombiaki } from "./index.js";
import { show, hide } from "./utils.js";
export function initMenu(race) {
    intro.classList.add('hidden');
    choose_race.classList.add('hidden');
    board_element.classList.remove('hidden');
    menu_element.classList.remove('hidden');
    reset_button.addEventListener('click', () => {
        window.location.reload();
    })

    chooseRace(race);
}

export function chooseRace(race) {
    const koniec_tury_ludzie = document.getElementById('rewers_stack_ludzie');
    const koniec_tury_zombiaki = document.getElementById('rewers_stack_zombiaki');

    if (race === 'ludzie') {
        hide(koniec_tury_zombiaki);
        show(koniec_tury_ludzie);
        cards_ludzie.forEach(card =>
            card.dataset.playable = true
        )
        cards_zombiaki.forEach(card =>
            card.dataset.playable = false
        )
    }

    if (race === 'zombiaki') {
        hide(koniec_tury_ludzie);
        show(koniec_tury_zombiaki);
        cards_zombiaki.forEach(card =>
            card.dataset.playable = true
        )
        cards_ludzie.forEach(card =>
            card.dataset.playable = false
        )
    }

}