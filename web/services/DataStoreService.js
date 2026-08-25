import { DbService } from "./DbService.js";
import { TimeSlotData } from "./TimeSlotData.js";

export class DataStoreService {
    #dbService;
    static OBJECT_STORE = "timeSheetData";
    static KEY_PATH = "key";

    constructor() {
        this.#dbService = new DbService("timeSheets", 1, (evt)=>{
            const store = evt.currentTarget.result.createObjectStore(
                DataStoreService.OBJECT_STORE, {
                    keyPath: DataStoreService.KEY_PATH,
                    autoIncrement: true
            });

            store.createIndex("dateIndex", "WorkDateTimeSerial", {
                unique: false
            });
        });
    }

    async get(id) {
        await this.#dbService.open();
        const res = await this.#dbService.get(DataStoreService.OBJECT_STORE, id);
        const obj = TimeSlotData.fromObject(res);
        return obj;
    }

    // Item must have a clone function
    async store(id, item) {
        const obj = item.toObject();
        obj[DataStoreService.KEY_PATH] = id;

        await this.#dbService.open();
        await this.#dbService.put(DataStoreService.OBJECT_STORE, obj);
        this.#dbService.close();
    }

    // Item must have a clone function
    async add(item) {
        const obj = item.toObject();

        await this.#dbService.open();
        const res = await this.#dbService.add(DataStoreService.OBJECT_STORE, obj);
        const id = res;

        this.#dbService.close();
       
        return id;
    }

    async remove(id) {
        await this.#dbService.open();
        this.#dbService.remove(DataStoreService.OBJECT_STORE, id);
        this.#dbService.close();
    }

    async *scan() {
        await this.#dbService.open();
        let cursor = await this.#dbService.getCursor(DataStoreService.OBJECT_STORE);
        while(cursor) {
            yield cursor.value;
            cursor = cursor.continue();
        }
    }
}

export class ReadOnlyStoreService {
    #dataStoreService;
    constructor(dataStoreService) {
        this.#dataStoreService = dataStoreService
    }

    async get(id) {
        return Object.freeze(await this.#dataStoreService.get(id));
    }
}
