import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"
import { DataStoreService, ReadOnlyStoreService } from "../services/DataStoreService.js"
import { TimeSlotData } from "../services/TimeSlotData.js";
import { formatUTCDateISO } from "../services/Utilities.js";

class ReadOnlyLookup {
    #data;
    
    constructor(data) {
        this.#data = data;
    }

    get (index) {
        return Object.freeze(this.#data.get(index).clone());
    }
}

export class timeEntry {
    #view;
    #timeEventManager;
    #nextDate;

    #responses = [
        "HPAI",
        "TB",
        "PCN",
        "Substantive"
    ];

    #timeItems = new Map();

    #dataStore = new DataStoreService("timeSlotStore");
    #readonlyLookup;

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();

        this.#readonlyLookup = new ReadOnlyStoreService(this.#dataStore);

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getUTCDate()));

        this.load(this.#dataStore);

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            this.addDay();
            //this.#timeEventManager.uiNewTimeEntryRequested(this);
        });

        //this.#timeEventManager.addEventListener("dataAdded", (data)=>{
        //    if (data.detail.requestor === this) {
        //        this.addDay(data.detail.newId);
        //    }
        //});

        this.#timeEventManager.addEventListener("uiDataUpdateRequested", async (data)=>{
            await this.#dataStore.store(data.detail.id, data.detail.newData);

            this.#timeEventManager.dataChanged(data.detail.id);
        });

        this.#timeEventManager.addEventListener("uiDataRemoveRequested", async (data)=>{
            const id = data.detail.id;
            const oldItem = await this.#dataStore.remove(id);
            this.#timeEventManager.dataRemoved(id, oldItem);
        })

        this.#timeEventManager.addEventListener("uiNewTimeEntryRequested", async (data)=>{
            const item = new TimeSlotData();
            item.StartDateTimeSerial = data.detail.suggestedStart
            const requestor = data.detail.requestor;

            item.WorkDateTimeSerial = requestor.dateSerial;

            const id = await this.#dataStore.add(item);
            
            this.#timeEventManager.dataAdded(id, requestor);
        });

        this.#timeEventManager.addEventListener("uiTimeSlotRemoved", async (data)=>{
            const id = data.detail.dataId;
            const item = await this.#dataStore.remove(id);
            this.#timeEventManager.dataRemoved(id, item);
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
            this.#timeEventManager.dataAdded(key, dataDict.get(item.WorkDateTimeSerial));
        }
    }

    addDay() {
        const nextDate = this.#getNextDate();
        const day = new timeItem(this.#timeEventManager, nextDate, this.#responses, this.#readonlyLookup);
        this.#timeItems.set(day, day);
        this.#timeEventManager.uiNewTimeEntryRequested(day);
        this.#view.refTimeItems.appendChild(day.viewRoot);
    }

    #getMaxTimeItemDate() {
        let max = Number.MIN_VALUE;
        for (const [key, val] of this.#timeItems) {
            max = Math.max(max, val.dateSerial);
        }
        console.log(`MAX: ${formatUTCDateISO(max)}`)
        return max;
    }

    #getNextDate() {
        if (this.#timeItems.size < 1) {
            return Math.floor(new Date());
        }
        else {
            return this.#getMaxTimeItemDate() + 86400000;
        }
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
