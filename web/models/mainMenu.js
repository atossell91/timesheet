import { mainMenuView } from "../compiled-views/mainMenuView.js"

export class mainMenu {
    #view;
    #timeEventManager

    constructor(timeEventManager) {
        this.#view = new mainMenuView();
        this.#timeEventManager = timeEventManager;

        this.#view.refAddMultiple.addEventListener("click", ()=>{
            this.#timeEventManager.uiDisplayChangeRequested("addMultiple");
        })
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
