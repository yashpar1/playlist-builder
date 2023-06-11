import { getFeats } from "./songInfo";

export async function createButton(element) {
    element.addEventListener('click', getFeats(element))
}