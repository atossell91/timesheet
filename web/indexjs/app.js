//import statements here!
import { timeEntry } from "../models/timeEntry.js";
import { TimeEventHandlerService } from "../services/timeEventManagerService.js"
import { TimeSlotData } from "../services/TimeSlotData.js";
import { DbService } from "../services/DbService.js";

export class App {

    #root;
    #timeEventManager;

     constructor() {
        this.#root = document.getElementsByTagName("body")[0];

        this.#timeEventManager = new TimeEventHandlerService();
    }

    async run() {
        DbService.deleteDb("timeSheets");

        const time = new timeEntry(this.#timeEventManager);

        this.#root.appendChild(time.viewRoot);
    }
}
