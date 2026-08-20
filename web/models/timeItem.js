import { timeItemView } from "../compiled-views/timeItemView.js"
import { DayData } from "../services/DayData.js";
import { timeItemTable } from "./timeItemTable.js"
import { formatDateISO } from "../services/Utilities.js";

export class timeItem {
    #view;
    #timeEventManager;
    #dayData;
    #table;
    #dateSerial;
    #responses;

    constructor(timeEventManager, dateSerial, responses) {
        this.#dateSerial = dateSerial;
        this.#responses = responses;

        this.#view = new timeItemView();
        this.#dayData = new DayData();
        this.#timeEventManager = timeEventManager;

        this.#view.refWorkDate.value = formatDateISO(dateSerial);

        this.#table = new timeItemTable(
            this.#timeEventManager,
            this.#dateSerial,
            this.#responses
        );

        this.#view.refAddSlice.addEventListener("click", ()=>{
            this.#table.addRow();
        })

        this.#view.refTimeSlices.append(this.#table.viewRoot);
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
