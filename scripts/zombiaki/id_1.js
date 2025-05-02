//MIŚ
import { useOverlay, putOverlay } from "./utils.js";
import { setBearPlayed } from "../index.js";



export default function zombiaki_id_1(card, field) {
    putOverlay(card, zombiaki_id_1_callback);
}

export function zombiaki_id_1_callback(field_board) {
    useOverlay(field_board);
    const overlay_elements = document.querySelectorAll('#overlay');
    overlay_elements.forEach(element => {
        if (!element.classList.contains('disable')) {
            element.classList.add('disable');
        }
    });
    setBearPlayed(true);
}