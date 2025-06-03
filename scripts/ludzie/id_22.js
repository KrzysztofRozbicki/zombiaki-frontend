//CHUCK

import { getDeckZombiaki, setDeckZombiaki, chosen_card_picture, chosen_card, play_card, close_card, closeCardHandler, removeCard, cancel_button } from '../index.js';
import { addListener, disable, show, showAlert } from '../utils.js';

export default function ludzie_id_22(card, field) {
    chuck();
}

let deck_zombiaki = [];

function chuck() {
    deck_zombiaki = Array.from(getDeckZombiaki());

    if (deck_zombiaki[0].name === "ŚWIT") {
        showAlert('NIE MOŻESZ USUNĄĆ KARTY ŚWIT');
        hide(cancel_button);
        return;
    }

    const thrown_card_src = deck_zombiaki[0].image_src;
    deck_zombiaki.splice(0, 1);
    setDeckZombiaki(deck_zombiaki);
    setTimeout(() => {
        show(chosen_card);
        console.log(thrown_card_src);
        chosen_card_picture.src = thrown_card_src;
        disable(play_card);
        play_card.innerText = 'USUNIĘTA KARTA';
    }, 10);
    addListener(close_card, closeCardHandler(), { once: true });
    removeCard();
    hide(cancel_button);
}