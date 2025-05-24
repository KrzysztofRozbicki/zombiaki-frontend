import { deck_zombiaki_element } from "./index.js";

export function showAlert(text) {
    const alert = document.getElementById('alert');
    const close_alert = document.getElementById('close_alert');
    const alert_text = document.getElementById('alert_text');

    alert_text.innerText = text;
    alert.classList.remove('hidden');

    close_alert.addEventListener('click', () => {
        alert.classList.add('hidden');
        if (text === 'NA POCZĄTKU TURY PRZESUŃ KARTĘ "KOT"' || text === 'NA POCZĄTKU TURY PRZESUŃ KARTĘ "PIES"') {
            disable(deck_zombiaki_element);
        }
    }, { once: true })
};

export function hideCancelButton() {
    const cancel_button = document.getElementById('cancel');
    hide(cancel_button);
    cancel_button.removeEventListener('click', cancel_button.handler);
    cancel_button.handler = null;
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