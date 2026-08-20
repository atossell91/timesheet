import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"

export class timeEntry {
    #view;
    #days = []
    #timeEventManager;

    #responses = [
        "HPAI",
        "TB",
        "PCN"
    ];

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();
        this.addDay();
        this.addDay();
    }

    addDay() {
        const day = new timeItem(this.#timeEventManager, Math.floor(new Date()), this.#responses);
        this.#view.refRoot.appendChild(day.viewRoot)
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
