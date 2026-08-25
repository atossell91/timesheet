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
        "PCN"
    ];

    #timeItems = new Map();

    #dataStore = new DataStoreService("timeSlotStore");
    #readonlyLookup;

    constructor(timeEventManager) {
        this.#timeEventManager = timeEventManager;

        this.#view = new timeEntryView();

        this.#readonlyLookup = new ReadOnlyStoreService(this.#dataStore);

        const tempDate = new Date();
        this.#nextDate = Math.floor(new Date(tempDate.getFullYear(), tempDate.getMonth()+1, tempDate.getDate()));

        this.#view.refAddTimeItem.addEventListener("click", ()=>{
            this.addDay();
            //this.#timeEventManager.uiNewTimeEntryRequested(this);
        });

        //this.#timeEventManager.addEventListener("dataAdded", (data)=>{
        //    if (data.detail.requestor === this) {
        //        this.addDay(data.detail.newId);
        //    }
        //});

        this.#timeEventManager.addEventListener("uiDataUpdateRequested", (data)=>{
            this.#dataStore.store(data.detail.id, data.detail.newData);

            this.#timeEventManager.dataChanged(data.detail.id);
        });

        this.#timeEventManager.addEventListener("uiDataRemoveRequested", (data)=>{
            const id = data.detail.id;
            const oldItem = this.#dataStore.remove(id);
            this.#timeEventManager.dataRemoved(id, oldItem);
        })

        this.#timeEventManager.addEventListener("uiNewTimeEntryRequested", (data)=>{
            const item = new TimeSlotData();
            const id = this.#dataStore.add(item);
            
            this.#timeEventManager.dataAdded(id, data.detail.requestor);
        });

        this.#timeEventManager.addEventListener("uiTimeSlotRemoved", (data)=>{
            const id = data.detail.dataId;
            const item = this.#dataStore.remove(id);
            this.#timeEventManager.dataRemoved(id, item);
        });

        this.#timeEventManager.addEventListener("uiDayEmpty", (data)=>{
            const dayId = data.detail.dayId;
            const item = this.#timeItems.get(dayId);
            this.#view.refTimeItems.removeChild(item.viewRoot);
            this.#timeItems.delete(dayId);
        })

    }

    load(dataArr) {
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

            const dataId = this.#dataStore.add(item);
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
