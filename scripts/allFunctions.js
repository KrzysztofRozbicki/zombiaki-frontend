import { humansFunctions } from "./humans/allFunctions.js";
import { zombiesFunctions } from "./zombies/allFunctions.js";

export const raceFunctions = { ...humansFunctions, ...zombiesFunctions }