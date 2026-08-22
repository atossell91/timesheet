export class DataStoreService {
    #data = new Map();
    #maxId = 0;
    #itemFactory;
    #storeName;
    #timeEventManager = null;

    constructor(storeName) {
        this.#storeName = storeName;
    }

    #calcMaxId() {
        max = Number.MIN_VALUE;
        this.#data.forEach((id)=>{
            max = Math.max(max, id);
        })
        return max;
    }

    get storeName() {
        return this.#storeName;
    }

    get(id) {
        return this.#data.get(id).clone();
    }

    #getMuteable(id) {
        return this.#data.get(id);
    }

    // Item must have a clone function
    store(id, item) {
        console.assert(this.#data.has(id), "ID does not exist in the data!!");
        this.#data.set(id, item.clone());
    }

    // Item must have a clone function
    add(item) {
        ++this.#maxId;
        this.#data.set(this.#maxId, item);
        return this.#maxId;
    }

    remove(id) {
        const item = this.get(id);
        this.#data.delete(id);
        return item;
    }

    /* Assume data is in the form:
     *  [
     *    {
     *      id: 1,
     *      data: object
     *    }, ...
     *  ]
    */
    load(data) {
        this.#maxId = Number.MIN_VALUE;
        console.assert(this.#data.size < 1, "Data is already present!");
        data.forEach((item)=>{
            console.assert(!this.#data.has(item.id));

            this.#maxId = Math.max(item.id, this.#maxId);
            this.#data.set(item.id, item.data);
        })
    }
}

export class ReadOnlyStoreService {
    #dataStoreService;
    constructor(dataStoreService) {
        this.#dataStoreService = dataStoreService
    }

    get(id) {
        return Object.freeze(this.#dataStoreService.get(id));
    }
}
