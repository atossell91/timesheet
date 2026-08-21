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

    uiDayEmpty(dayId) {
        this.dispatchEvent(new CustomEvent("uiDayEmpty", {
            detail: {
                dayId: dayId
            }
        }))
    }

    dataTimeInfoChanged(data, updateUI) {
        let dataObj = { detail: {}}
        for (const key in data) {
            dataObj.detail[key] = data[key];
        }
        dataObj.detail["updateUI"] = updateUI;

        this.dispatchEvent(new CustomEvent("dataTimeInfoChanged", dataObj));
    }

    dataTimeInfoAdded(id, updateUI) {
        this.dispatchEvent(new CustomEvent("dataTimeInfoAdded", {
            detail: { 
                id: id,
                updateUI: updateUI
            }
        }));
    }

    dataTimeInfoRemoved(id, updateUI) {
        this.dispatchEvent(new CustomEvent("dataTimeInfoRemoved", {
            detail: { 
                id: id,
                updateUI: updateUI
            }
        }));
    }
}