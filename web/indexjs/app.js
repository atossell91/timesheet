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
        DbService.deleteDb("lexi");
        const dSrv = new DbService("lexi", 1, (evt)=>{
            console.log("SETUP");
            evt.currentTarget.result.createObjectStore("timeData1", {keyPath: "id", autoIncrement: true})
        });

        await dSrv.open();
        await dSrv.add({girl: "girl"}, "timeData1");
        const abn = await dSrv.get("timeData1", 1);
        console.log(abn)

        console.log("DONE!");
        return;
        const time = new timeEntry(this.#timeEventManager);
        
        const serial = Math.floor(new Date(1991, 9, 10));
        const d = new TimeSlotData();
        
        const serial2 = Math.floor(new Date(1991, 9, 11));
        const d2 = new TimeSlotData();
        d2.Response = "PCN"

        d.WorkDateTimeSerial = serial;
        d.StartDateTimeSerial = serial;
        d.EndDateTimeSerial = serial;

        d2.WorkDateTimeSerial = serial2;
        d2.StartDateTimeSerial = serial2;
        d2.EndDateTimeSerial = serial2;
        
        d.LunchBreak = true;
        d2.LunchDelivered = true;

        time.load([
            d, d2
        ]);

        this.#root.appendChild(time.viewRoot);
    }
}
