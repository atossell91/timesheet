export class TimeSlotData {
    constructor() {
        this.WorkDateTimeSerial = 0;
        this.StartDateTimeSerial = 0;
        this.EndDateTimeSerial = 0;
        this.Response = 0;
        this.LunchBreak = false;
        this.LunchDelivered = false;
    }

    clone() {
        const newData = new TimeSlotData();
        
        newData.WorkDateTimeSerial = this.WorkDateTimeSerial;
        newData.StartDateTimeSerial = this.StartDateTimeSerial;
        newData.EndDateTimeSerial = this.EndDateTimeSerial;
        newData.Response = this.Response;
        newData.LunchBreak = this.LunchBreak;
        newData.LunchDelivered = this.LunchDelivered;

        return newData;
    }

    toObject() {
        return {
            WorkDateTimeSerial: this.WorkDateTimeSerial,
            StartDateTimeSerisl: this.StartDateTimeSerisl,
            EndDateTimeSerial: this.EndDateTimeSerial,
            Response: this.Response,
            LunchBreak: this.LunchBreak,
            LunchDelivered: this.LunchDelivered
        }
    }

    static fromObject(object) {
        const data = new TimeSlotData();

        data.WorkDateTimeSerial = object["WorkDateTimeSerial"],
        data.StartDateTimeSerisl = object["StartDateTimeSerisl"],
        data.EndDateTimeSerial = object["EndDateTimeSerial"],
        data.Response = object["Response"],
        data.LunchBreak = object["LunchBreak"],
        data.LunchDelivered = object["LunchDelivered"]

        return data;
    }
}
