import { timeItemView } from "../compiled-views/timeItemView.js"
import { DayData } from "../services/DayData.js";
import { formatDateISO } from "../services/Utilities.js";
import { timeItemRow } from "./timeItemRow.js"

export class timeItem {
    #view;
    #timeEventManager;
    #dayData;
    #dateSerial;
    #responses;
    #lookupData;

    #rows = new Map();

    constructor(timeEventManager, dateSerial, responses, lookupData) {
        this.#dateSerial = dateSerial;
        this.#responses = responses;
        this.#lookupData = lookupData;

        this.#view = new timeItemView();
        this.#dayData = new DayData();
        this.#timeEventManager = timeEventManager;

        this.#view.refWorkDate.value = formatDateISO(dateSerial);

        this.#view.refAddSlice.addEventListener("click", ()=>{
            this.#timeEventManager.uiNewTimeEntryRequested(this);
        })

        // This might cause a stack overflow by triggering UiChanged -> dataChanged -> uiChanged etc...
        this.#timeEventManager.addEventListener("dataChanged", (data)=>{
            if (this.#rows.has(data.detail.id)) {
                this.#calcTotalHours();
            }
        });

        this.#timeEventManager.addEventListener("dataAdded", (data)=>{
            if (data.detail.requestor === null || data.detail.requestor !== this) return;

            this.addRow(data.detail.newId);

            this.#calcTotalHours();
        });

        this.#timeEventManager.addEventListener("dataRemoved", (data)=>{
            if (!this.#rows.has(data.detail.oldId)) return; 

            const row = this.#rows.get(data.detail.oldId);
            
            this.#view.refTableBody.removeChild(row.viewRoot);
            this.#rows.delete(data.detail.oldId);
            this.#calcTotalHours();

            if (this.#rows.size < 1) {
                this.#timeEventManager.uiDayEmpty(this)
            }
        });

        this.#timeEventManager.uiNewTimeEntryRequested(this);
    }

    #sumHours() {
        let totalHours = 0.0

        for (const item in this.#rows) {
            const data = this.#lookupData.get(item);
            let diff = data.EndDateTimeSerial - data.StartDateTimeSerial;
            if (data.LunchBreak) {
                diff -= 1800000;
            }
            totalHours += diff;
        }
        return totalHours;
    }

    #calcTotalHours() {
        const hours = this.#sumHours() / 3600000;
        this.#view.refTotalHours.innerText = Math.max(0, hours);

        this.#view.refRegularHours.innerText = Math.max(0, Math.min(hours, 7.5))
    }

    addRow(rowId) {
        const row = new timeItemRow(rowId, this.#lookupData, this.#timeEventManager, this.#dateSerial, this.#responses);
        this.#rows.set(rowId, row);
        this.#view.refTableBody.append(row.viewRoot);
        this.#timeEventManager.uiTimeSlotAdded({
            object: row,
            value: row.timeSlotData
        });
    }

    get dayData() {
        return this.#dayData;
    }

    get viewRoot() {
        return this.#view.refRoot;
    }

    set totalHours(hours) {
        this.#view.refTotalHours.innerText = hours;
    }

    set overtimeHours(hours) {
        this.#view.refOvertimeHours.innerText = hours;
    }

    set regularHours(hours) {
        this.#view.refRegularHours.innerText = hours;
    }
}
