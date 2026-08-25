import { TimeSlotData } from "./TimeSlotData.js";

export class DbService {
    static READ_ONLY = "readonly";
    static READ_WRITE = "readwrite";

    static DEFAULT_STORE_NAME = "_DEFAULT"

    #database;

    #dbName;
    #version;
    #setupFunction;

    constructor(dbName, version, setupFunction) {
        this.#dbName = dbName;
        this.#version = version;
        this.#setupFunction = setupFunction;
    }

    static promiseifyRequest(request) {
        return new Promise((accept, reject) => {
            request.onsuccess = (ev) => { accept(ev.target.result); };
            request.onerror = (ev) => { reject(ev.target.error); }
        })
    }

    async open() {
        const req = indexedDB.open(this.#dbName, this.#version);
        req.onupgradeneeded = this.#setupFunction;
        this.#database = await DbService.promiseifyRequest(req);
    }

    getObjectStore(mode, store=DbService.DEFAULT_STORE_NAME) {
        const tx = this.#database.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    add(store=DbService.DEFAULT_STORE_NAME, object) {
        const tx = this.#database.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store)
        return DbService.promiseifyRequest(objectStore.add(object));
    }

    remove(store, key) {
        const tx = this.#database.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store)
        return DbService.promiseifyRequest(objectStore.delete(key));
    }

    get(store, key) {
        const tx = this.#database.transaction([store], DbService.READ_ONLY);
        const objectStore = tx.objectStore(store)
        return DbService.promiseifyRequest(objectStore.get(key));
    }

    put(store, data) {
        const tx = this.#database.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store)
        return DbService.promiseifyRequest(objectStore.put(data));
    }

    getCursor(store) {
        const tx = this.#database.transaction([store]);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.openCursor());
    }

    static async deleteDb(name) {
        const req = indexedDB.deleteDatabase(name)
        return DbService.promiseifyRequest(req);
    }

    async close() {
        this.#database.close();
    }
}