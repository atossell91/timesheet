import { timeItemTableView } from "../compiled-views/timeItemTableView.js"
import { timeItemRow } from "./timeItemRow.js"

export class timeItemTable {
    #view;
    #timeEventManager;

    #dateSerial;
    #responses;

    #rows = new Map();

    constructor(timeEventManager, dateSerial, responses) {
        this.#dateSerial = dateSerial;
        this.#responses = responses;

        this.#view = new timeItemTableView();
        this.#timeEventManager = timeEventManager;
        this.addRow();
    }

    addRow() {
        const row = new timeItemRow(this.#timeEventManager, this.#dateSerial, this.#responses);
        this.#rows.set(row, row);
        this.#view.refTableBody.append(row.viewRoot);
        this.#timeEventManager.timeSlotAdded(row);
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
