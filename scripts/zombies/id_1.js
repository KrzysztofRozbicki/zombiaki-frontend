//MIŚ
import { useBear, putOverlay } from "./utils.js";
import { setBearPlayed } from "../index.js";



export default function zombies_id_1(card, field) {
    putOverlay(card, zombies_id_1_callback);
}

export function zombies_id_1_callback(field_board) {
    useBear(field_board);
    const overlay_elements = document.querySelectorAll('.overlay_container');
    overlay_elements.forEach(element => {
        if (!element.classList.contains('disable')) {
            element.classList.add('disable');
        }
    });
    setBearPlayed(true);
}