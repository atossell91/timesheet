export class DbService {
    static READ_ONLY = "readonly";
    static READ_WRITE = "readwrite";

    static DEFAULT_STORE_NAME = "_DEFAULT"

    static staticDatabase;

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
        DbService.staticDatabase = await DbService.promiseifyRequest(req);
    }

    getObjectStore(mode, store=DbService.DEFAULT_STORE_NAME) {
        const tx = DbService.staticDatabase.transaction(storeName, mode);
        return tx.objectStore(storeName);
    }

    add(store=DbService.DEFAULT_STORE_NAME, object) {
        const tx = DbService.staticDatabase.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.add(object));
    }

    remove(store, key) {
        const tx = DbService.staticDatabase.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.delete(key));
    }

    get(store, key) {
        const tx = DbService.staticDatabase.transaction([store], DbService.READ_ONLY);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.get(key));
    }

    put(store, data) {
        const tx = DbService.staticDatabase.transaction([store], DbService.READ_WRITE);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.put(data));
    }

    async *scan(store) {
        let cursor = await this.getCursor(store, DbService.READ_WRITE);
        while(cursor) {
            yield cursor.value;
            cursor.continue();
            cursor = await DbService.promiseifyRequest(cursor.request);
        }
    }

    getCursor(store, mode) {
        const tx = DbService.staticDatabase.transaction([store], mode);
        const objectStore = tx.objectStore(store);
        return DbService.promiseifyRequest(objectStore.openCursor());
    }

    static async deleteDb(name) {
        const req = indexedDB.deleteDatabase(name)
        return DbService.promiseifyRequest(req);
    }

    async close() {
        DbService.staticDatabase.close();
    }
}