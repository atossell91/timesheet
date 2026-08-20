export class DayData {
    constructor() {
        this.lunchBreak = true;
        this.date = Date.now();
        this.totalHours = 0;
        this.regularHours = 0;
        this.otHours = 0;
    }

    clone() {
        const newData = new DayData();

        newData.lunchBreak = this.lunchBreak
        newData.date = this.date;
        newData.totalHours = this.totalHours;
        newData.regularHours = this.regularHours;
        newData.otHours = this.otHours;

        return newData;
    }
}