//MIŚ
import { removeHealth, putOverlay } from "./utils.js";
import { setBearPlayed } from "../index.js";



export default function zombiaki_id_1(card, field) {
    putOverlay(card, zombiaki_id_1_callback);
}

export function zombiaki_id_1_callback(field_board) {
    removeHealth(field_board, { overlay: true });
    const overlay_elements = document.querySelectorAll('#overlay');
    overlay_elements.forEach(element => {
        if (!element.classList.contains('disable')) {
            element.classList.add('disable');
        }
    });
    setBearPlayed(true);
}