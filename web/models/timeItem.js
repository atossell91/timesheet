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
            this.addRow();
        })

        this.addRow();
    }

    addRow() {
        const row = new timeItemRow(this.#timeEventManager, this.#dateSerial, this.#responses);
        this.#rows.set(row, row);
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
