import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"
import { DataStoreService, ReadOnlyStoreService } from "../services/DataStoreService.js"
import { TimeSlotData } from "../services/TimeSlotData.js";

export class timeEntry {
    #view;
    #timeEventManager;
    #nextDate;

    #responses;

    #timeItems = new Map();

    #readonlyLookup;

    constructor(timeEventManager, responses, readonlyLookup) {
        this.#timeEventManager = timeEventManager;
        this.#responses = responses;

        this.#readonlyLookup = readonlyLookup;

        this.#view = new timeEntryView();

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getUTCDate()));

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            const day = this.addDay();
            this.#timeEventManager.uiNewTimeEntryRequested(day);
        });

        this.#timeEventManager.addEventListener("uiDayEmpty", (data)=>{
            const dayId = data.detail.dayId;
            const item = this.#timeItems.get(dayId);
            this.#view.refTimeItems.removeChild(item.viewRoot);
            this.#timeItems.delete(dayId);
        })
    }

    async load(dataStore) {
        const dataDict = new Map();
        for await (const object of dataStore.scan()) {
            const item = object.data;
            const key = object[DataStoreService.KEY_PATH];
            if (!dataDict.has(item.WorkDateTimeSerial)) {
                const tItem = new timeItem(
                    this.#timeEventManager,
                    item.WorkDateTimeSerial,
                    this.#responses,
                    this.#readonlyLookup);
                this.#timeItems.set(tItem, tItem);
                dataDict.set(item.WorkDateTimeSerial, tItem);
                this.#view.refTimeItems.appendChild(tItem.viewRoot);
            }

            //const dataId = await this.#dataStore.add(item);
            this.#timeEventManager.dataAdded(dataId, dataDict.get(item.WorkDateTimeSerial));
        }
    }

    addDay() {
        const nextDate = this.#nextDate;
        const day = new timeItem(this.#timeEventManager, nextDate, this.#responses, this.#readonlyLookup);
        this.#timeItems.set(day, day);
        this.#nextDate += 86400000;
        this.#view.refTimeItems.appendChild(day.viewRoot)
        return day;
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
