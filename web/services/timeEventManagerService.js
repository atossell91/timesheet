export class TimeEventHandlerService extends EventTarget {
    constructor() {
        super();
    }

    uiTimeInfoChanged(data) {
        let dataObj = { detail: {}}
        for (const key in data) {
            dataObj.detail[key] = data[key];
        }

        this.dispatchEvent(new CustomEvent("uiTimeInfoChanged", dataObj));
    }

    uiTimeSlotAdded(data) {
        let dataObj = { detail: {}}
        for (const key in data) {
            dataObj.detail[key] = data[key];
        }

        this.dispatchEvent(new CustomEvent("uiTimeSlotAdded", dataObj));
    }

    uiTimeSlotRemoved(id) {
        this.dispatchEvent(new CustomEvent("uiTimeSlotRemoved", {
            detail: { id: id }
        }));
    }

    dataTimeInfoChanged(data) {
        let dataObj = { detail: {}}
        for (const key in data) {
            dataObj.detail[key] = data[key];
        }

        this.dispatchEvent(new CustomEvent("dataTimeInfoChanged", dataObj));
    }

    dataTimeInfoAdded(id) {
        this.dispatchEvent(new CustomEvent("dataTimeInfoAdded", {
            detail: { id: id }
        }));
    }

    dataTimeInfoRemoved(id) {
        this.dispatchEvent(new CustomEvent("dataTimeInfoRemoved", {
            detail: { id: id }
        }));
    }
}