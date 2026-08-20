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

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth()+1, tempDate.getDate()));

        this.addDay();

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            this.addDay();
        });

        this.#timeEventManager.addEventListener("timeslotInfoChanged", (data)=>{
            console.log("Row changed!");
            console.log(data.detail)
        })

        this.#timeEventManager.addEventListener("timeslotAdded", (data)=>{
            console.log("Row Added!");
            console.log(data.detail)
        })

        this.#timeEventManager.addEventListener("timeslotRemoved", (data)=>{
            console.log("Row Deleted!");
            console.log(data.detail)
        })
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
