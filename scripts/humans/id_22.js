//CHUCK

import { getDeckzombies, setDeckzombies, chosen_card_picture, chosen_card, play_card, close_card, closeCardHandler, removeCard, cancel_button } from '../index.js';
import { addListener, disable, hide, show, showAlert } from '../utils.js';

export default function humans_id_22(card, field) {
    chuck();
}

let deck_zombies = [];

function chuck() {
    deck_zombies = Array.from(getDeckzombies());

    if (deck_zombies[0].name === "ŚWIT") {
        showAlert('NIE MOŻESZ USUNĄĆ KARTY ŚWIT');
        hide(cancel_button);
        return;
    }

    const thrown_card_src = deck_zombies[0].image_src;
    deck_zombies.splice(0, 1);
    setDeckzombies(deck_zombies);
    setTimeout(() => {
        show(chosen_card);
        chosen_card_picture.src = thrown_card_src;
        disable(play_card);
        play_card.innerText = 'USUNIĘTA KARTA';
        hide(cancel_button);
    }, 10);
    addListener(close_card, closeCardHandler(), { once: true });
    removeCard();
}