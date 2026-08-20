export class TimeEventHandlerService extends EventTarget {
    constructor() {
        super();
    }

    timeSlotInfoChanged() {
        this.dispatchEvent(new CustomEvent("timeslotInfoChanged", {}))
    }

    dayInfoChanged() {
        this.dispatchEvent(new CustomEvent("dayInfoChanged", {}))
    }

    timeSlotAdded(id) {
        this.dispatchEvent(new CustomEvent("timeslotAdded", {
            id: id
        }));
    }

    timeslotRemoved(id) {
        this.dispatchEvent(new CustomEvent("timeslotRemoved", {
            id: id
        }));
    }

    dayAdded(id) {
        this.dispatchEvent(new CustomEvent("dayAdded", {
            id: id
        }));
    }

    dayRemoved(id) {
        this.dispatchEvent(new CustomEvent("dayRemoved", {
            id: id
        }));
    }
}