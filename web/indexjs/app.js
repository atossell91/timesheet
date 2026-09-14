//import statements here!
import { timeEntry } from "../models/timeEntry.js";
import { mainMenu } from "../models/mainMenu.js"
import { TimeEventHandlerService } from "../services/timeEventManagerService.js"
import { TimeSlotData } from "../services/TimeSlotData.js";
import { DbService } from "../services/DbService.js";
import { infanticide } from "../services/Utilities.js";
import { DataStoreService, ReadOnlyStoreService } from "../services/DataStoreService.js";

export class App {
    #responses = [
        "HPAI",
        "TB",
        "PCN",
        "Substantive"
    ];

    #dataStore = new DataStoreService("timeSlotStore");

    #root;
    #timeEventManager;

    #views = new Map();

     constructor() {
        this.#root = document.getElementsByTagName("body")[0];

        this.#timeEventManager = new TimeEventHandlerService();

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
    }

    async run() {
        const menu = new mainMenu(this.#timeEventManager);
        const time = new timeEntry(this.#timeEventManager, this.#responses, new ReadOnlyStoreService(this.#dataStore));

        this.#views.set("mainMenu", menu);
        this.#views.set("addMultiple", time);

        this.#root.appendChild(menu.viewRoot);

        this.#timeEventManager.addEventListener("uiDisplayChangeRequested", (data)=>{
            if (this.#views.has(data.detail.newViewName)) {
                // remove children
                infanticide(this.#root)
                this.#root.appendChild(this.#views.get(data.detail.newViewName).viewRoot);
            }
            else {
                console.log(`View name '${data.detail.newViewName}' cannot be found`);
            }
        })
    }
}
