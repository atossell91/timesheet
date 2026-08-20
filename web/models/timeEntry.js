import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"

export class timeEntry {
    #view;
    #timeEventManager;
    #nextDate;

    #responses = [
        "HPAI",
        "TB",
        "PCN"
    ];

    #timeSlots = new Map();

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth()+1, tempDate.getDate()));

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            this.addDay();
        });

        this.#timeEventManager.addEventListener("uiTimeInfoChanged", (data)=>{
            this.#timeSlots.get(data.detail.object).makeSameAs(data.detail.value);
        });

        this.#timeEventManager.addEventListener("uiTimeSlotAdded", (data)=>{
            this.#timeSlots.set(data.detail.object, data.detail.value.clone());
        });

        this.#timeEventManager.addEventListener("uiTimeSlotRemoved", (data)=>{
            this.#timeSlots.delete(data.detail.object);
        });

        this.addDay();
    }

    addDay() {
        const day = new timeItem(this.#timeEventManager, this.#nextDate, this.#responses);
        this.#nextDate += 86400000;
        this.#view.refTimeItems.appendChild(day.viewRoot)
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
