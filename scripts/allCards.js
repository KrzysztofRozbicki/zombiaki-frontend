import { ludzieFunctions } from "./ludzie/allCards.js";
import { zombiakiFunctions } from "./zombiaki/allCards.js";

export const raceFunctions = { ...ludzieFunctions, ...zombiakiFunctions }