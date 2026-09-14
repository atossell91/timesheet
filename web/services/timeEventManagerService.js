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

    uiNewTimeEntryRequested(requestor, suggestedStart) {
        this.dispatchEvent(new CustomEvent("uiNewTimeEntryRequested", { detail: { requestor: requestor, suggestedStart: suggestedStart }}));
    }

    uiDataUpdateRequested(id, field, newData) {
        this.dispatchEvent(new CustomEvent("uiDataUpdateRequested", { detail: {
            id: id,
            field: field,
            newData: newData
        }}))
    }

    uiDataRemoveRequested(id) {
        this.dispatchEvent(new CustomEvent("uiDataRemoveRequested", { detail: {
            id: id
        }}));
    }

    dataAdded(newId, requestor=null) {
        this.dispatchEvent(new CustomEvent("dataAdded", { detail: {
            newId: newId,
            requestor: requestor
        }}));
    }

    dataChanged(id) {
        this.dispatchEvent(new CustomEvent("dataChanged", { detail: {
            id: id
        }}));
    }

    dataRemoved(id, item) {
        this.dispatchEvent(new CustomEvent("dataRemoved", { detail: {
            oldId: id,
            oldItem: item
        }}));
    }
}