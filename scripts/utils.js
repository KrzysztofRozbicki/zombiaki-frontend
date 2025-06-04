import { deck_zombiaki_element, cancel_button } from "./index.js";

export function showAlert(text, game_over = false, instruction = false) {
    const alert = document.getElementById('alert');
    const close_alert = document.getElementById('close_alert');
    const alert_text = document.getElementById('alert_text');
    if (instruction) alert.classList.add('instruction');

    if (instruction) {
        alert_text.innerHTML = text;
    } else {
        alert_text.innerText = text;
    }
    alert.classList.remove('hidden');

    close_alert.addEventListener('click', () => {
        if (instruction) alert.classList.remove('instruction');
        alert.classList.add('hidden');
        if (text === 'NA POCZĄTKU TURY PRZESUŃ KARTĘ "KOT"' || text === 'NA POCZĄTKU TURY PRZESUŃ KARTĘ "PIES"') {
            disable(deck_zombiaki_element);
        }
    }, { once: true })
    if (game_over) {
        close_alert.addEventListener('click', () => window.location.reload());
    }
};

export function hideCancelButton() {
    hide(cancel_button);
    removeListener(cancel_button);
}

export function show(element) {
    element.classList.remove('hidden');
}

export function showAll(array) {
    array.forEach(el => el.classList.remove('hidden'))
}

export function hide(element) {
    element.classList.add('hidden');
}

export function enable(element) {
    element.classList.remove('disable');
}

export function disable(element) {
    element.classList.add('disable');
}

export function hideAll(array) {
    array.forEach(el => el.classList.add('hidden'))
}

export function randomRotate(number, element) {
    const degrees = Math.floor(Math.random() * (number - -number) + -number);
    element.style = `transform:rotate(${degrees}deg);`
}

export function addListener(element, callback, once = false) {
    const handler = callback;
    if (!once) element.addEventListener('click', handler);
    else element.addEventListener('click', handler, { once: true });
    element.handler = handler;
}

export function removeListener(element) {
    element.removeEventListener('click', element.handler);
    element.handler = null;
}