//import statements here!
import { timeEntry } from "../models/timeEntry.js";
import { TimeEventHandlerService } from "../services/timeEventManagerService.js"

export class App {

    #root;
    #timeEventManager;

     constructor() {
        this.#root = document.getElementsByTagName("body")[0];

        this.#timeEventManager = new TimeEventHandlerService();
    }

    async run() {
        navigator.storage.persist().then((res)=>{
            console.log(`Browser persistence is ${res}`);
        });
        
        const time = new timeEntry(this.#timeEventManager);

        this.#root.appendChild(time.viewRoot);
    }
}
