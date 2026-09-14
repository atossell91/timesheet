import { preferencesView } from "../compiled-views/preferencesView.js"

export class preferences {
    #view;

    constructor() {
        this.#view = new preferencesView();
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
