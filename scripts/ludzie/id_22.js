//CHUCK

import { getDeckZombiaki, setDeckZombiaki, removeCard } from '../index.js';

export default function ludzie_id_22(card, field) {
    chuck();
}

let deck_zombiaki = [];

function chuck() {
    deck_zombiaki = Array.from(getDeckZombiaki());
    deck_zombiaki.splice(0, 1);
    setDeckZombiaki(deck_zombiaki);
    removeCard();
}