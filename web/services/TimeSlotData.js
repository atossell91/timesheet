export class TimeSlotData {
    constructor() {
        this.StartDateTimeSerial = 0;
        this.EndDateTimeSerial = 0;
        this.Response = 0;
        this.LunchBreak = false;
        this.LunchDelivered = false;
    }

    clone() {
        const newData = new TimeSlotData();
        
        newData.StartDateTimeSerial = this.StartDateTimeSerial;
        newData.EndDateTimeSerial = this.EndDateTimeSerial;
        newData.Response = this.Response;
        newData.LunchBreak = this.LunchBreak;
        newData.LunchDelivered = this.LunchDelivered;

        return newData;
    }

    makeSameAs(other) {
        this.StartDateTimeSerial = other.StartDateTimeSerial;
        this.EndDateTimeSerial = other.EndDateTimeSerial;
        this.Response = other.Response;
        this.LunchBreak = other.LunchBreak;
        this.LunchDelivered = other.LunchDelivered;
    }
}