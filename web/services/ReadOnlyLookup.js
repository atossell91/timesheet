export class ReadOnlyLookup {
    #data;

    constructor(data, accessorFunc) {
        this.#data = data;
    }

    access(index) {
        return accessorFunc(this.#data, index);
    }
}