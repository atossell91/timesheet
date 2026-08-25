import { timeEntryView } from "../compiled-views/timeEntryView.js"
import { timeItem } from "./timeItem.js"
import { DataStoreService, ReadOnlyStoreService } from "../services/DataStoreService.js"
import { TimeSlotData } from "../services/TimeSlotData.js";

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
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate()));

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

            const iter = await this.#dataStore.scan();
            for await (let itm of iter) {
                console.log(itm)
            }
            
        });

        this.#timeEventManager.addEventListener("uiDataRemoveRequested", async (data)=>{
            const id = data.detail.id;
            const oldItem = await this.#dataStore.remove(id);
            this.#timeEventManager.dataRemoved(id, oldItem);
        })

        this.#timeEventManager.addEventListener("uiNewTimeEntryRequested", async (data)=>{
            const item = new TimeSlotData();
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

    async load(dataArr) {
        const dataDict = new Map();
        for (const item of dataArr) {
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

            const dataId = await this.#dataStore.add(item);
            this.#timeEventManager.dataAdded(dataId, dataDict.get(item.WorkDateTimeSerial));
        }
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
