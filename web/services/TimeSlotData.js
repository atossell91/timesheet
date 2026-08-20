export class TimeSlotData {
    constructor() {
        this.StartDateTimeSerial = 0;
        this.EndDateTimeSerial = 0;
        this.Response = 0;
    }

    clone() {
        const newData = TimeSlotData();
        
        newData.StartDateTimeSerial = this.StartDateTimeSerial;
        newData.EndDateTimeSerial = this.EndDateTimeSerial;
        newData.Response = this.Response;

        return newData;
    }
}