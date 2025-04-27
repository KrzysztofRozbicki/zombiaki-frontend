const reset_button = document.getElementById('reset');
const intro = document.getElementById('intro');
const board_element = document.getElementById('board');
const menu_element = document.getElementById('menu');
const choose_race = document.getElementById('choose-race');

export function initMenu() {
    intro.classList.add('hidden');
    choose_race.classList.add('hidden');
    board_element.classList.remove('hidden');
    menu_element.classList.remove('hidden');
    reset_button.addEventListener('click', () => {
        window.location.reload();
    })
}