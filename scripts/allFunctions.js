import { ludzieFunctions } from "./ludzie/allFunctions.js";
import { zombiakiFunctions } from "./zombiaki/allFunctions.js";

export const raceFunctions = { ...ludzieFunctions, ...zombiakiFunctions }