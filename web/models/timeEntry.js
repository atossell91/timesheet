import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"

class ReadOnlyLookup {
    #data;
    
    constructor(data) {
        this.#data = data;
    }

    get (index) {
        return this.#data.get(index).clone();
    }
}

export class timeEntry {
    #view;
    #timeEventManager;
    #nextDate;

    #responses = [
        "HPAI",
        "TB",
        "PCN"
    ];

    #timeItems = new Map();

    #timeSlots = new Map();
    #readonlyLookup;

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();

        this.#readonlyLookup = new ReadOnlyLookup(this.#timeSlots);

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth()+1, tempDate.getDate()));

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            this.addDay();
        });

        this.#timeEventManager.addEventListener("uiTimeInfoChanged", (data)=>{
            const dataObject = this.#timeSlots.get(data.detail.object);
            dataObject.makeSameAs(data.detail.value);

            this.#timeEventManager.dataTimeInfoChanged({ 
                object: data.detail.object
            }, false);
        });

        this.#timeEventManager.addEventListener("uiTimeSlotAdded", (data)=>{
            this.#timeSlots.set(data.detail.object, data.detail.value.clone());
            
            this.#timeEventManager.dataTimeInfoAdded({ 
                object: data.detail.object
            }, false);
        });

        this.#timeEventManager.addEventListener("uiTimeSlotRemoved", (data)=>{
            const id = data.detail.id;
            this.#timeSlots.delete(id);
            this.#timeEventManager.dataTimeInfoRemoved(id, false);
        });

        this.#timeEventManager.addEventListener("uiDayEmpty", (data)=>{
            const dayId = data.detail.dayId;
            const item = this.#timeItems.get(dayId);
            this.#view.refTimeItems.removeChild(item.viewRoot);
            this.#timeItems.delete(dayId);
        })

        this.addDay();
    }

    addDay() {
        const day = new timeItem(this.#timeEventManager, this.#nextDate, this.#responses, this.#readonlyLookup);
        this.#timeItems.set(day, day);
        this.#nextDate += 86400000;
        this.#view.refTimeItems.appendChild(day.viewRoot)
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
