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

        this.#view.refUserPreferences.addEventListener("click", ()=>{
            this.#timeEventManager.uiDisplayChangeRequested("userPreferences");
        })
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
