import { timeItemRowView } from "../compiled-views/timeItemRowView.js"
import { TimeSlotData } from "../services/TimeSlotData.js"
import { createDateSerial } from "../services/Utilities.js";
import { formatDateISO } from "../services/Utilities.js";

export class timeItemRow {
    #view;
    #timeEventManager;
    #timeSlotData;

    constructor(timeEventManager, dateSerial, responses) {
        this.#view = new timeItemRowView();
        this.#timeEventManager = timeEventManager;
        this.#timeSlotData = new TimeSlotData();

        this.#timeEventManager.addEventListener("dataTimeInfoChanged", (data)=>{
            if (!data.detail.updateUI) return;
        });

        this.#timeEventManager.addEventListener("dataTimeInfoAdded", (data)=>{
            if (!data.detail.updateUI) return;
        });

        this.#timeEventManager.addEventListener("dataTimeInfoRemoved", (data)=>{
            if (!data.detail.updateUI) return;
        });

        this.#view.refTimeSlotDate.value = formatDateISO(dateSerial);
        this.#setResponseOptions(responses);

        this.#view.refStartHour.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
        });

        this.#view.refStartMinutes.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
        });

        this.#view.refEndHour.addEventListener("change", ()=>{
            this.#calcEndDate();
        });

        this.#view.refEndMinutes.addEventListener("change", ()=>{
            this.#calcEndDate();
        });

        this.#view.refResponse.addEventListener("change", ()=>{
            this.#timeEventManager.uiTimeInfoChanged({
                object: this,
                field: "response",
                value: this.#timeSlotData
            });
        });

        this.#view.refTimeSlotDate.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
        });

        this.#view.refLunchBreak.addEventListener("change", ()=>{
            this.#timeSlotData.LunchBreak = this.#view.refLunchBreak.checked;
            this.#timeEventManager.uiTimeInfoChanged({
                object: this,
                field: "lunchBreak",
                value: this.#timeSlotData
            });
        });

        this.#view.refLunchDelivered.addEventListener("change", ()=>{
            this.#timeSlotData.LunchDelivered = this.#view.refLunchDelivered.checked;
            this.#timeEventManager.uiTimeInfoChanged({
                object: this,
                field: "lunchDelivered",
                value: this.#timeSlotData
            });
        });

        this.#view.refDeleteRow.addEventListener("click", ()=>{
            this.#timeEventManager.uiTimeSlotRemoved(this);
        })
    }

    #setResponseOptions(responses) {
        responses.forEach((response)=>{
            const elem = document.createElement("option");
            elem.setAttribute("value", response);
            elem.innerText = response;
            this.#view.refResponse.appendChild(elem);
        });
    }

    #trySetStartDateTime() {
        if (this.#view.refTimeSlotDate.value !== "" &&
            this.#view.refStartHour.value !== "" &&
            this.#view.refStartMinutes.value !== "") {
                const dateSerial = createDateSerial(
                    this.#view.refTimeSlotDate.value,
                    this.#view.refStartHour.value,
                    this.#view.refStartMinutes.value
                );
                this.#timeSlotData.StartDateTimeSerial = dateSerial;
                this.#calcEndDate();

                this.#timeEventManager.uiTimeInfoChanged({
                    object: this,
                    field: "startTime",
                    value: this.#timeSlotData
                });
        }
    }

    #calcEndDate() {
        if (this.#view.refTimeSlotDate.value !== "" &&
            this.#view.refEndHour.value !== "" &&
            this.#view.refEndMinutes.value !== "") {
                let dateSerial = createDateSerial(
                    this.#view.refTimeSlotDate.value,
                    this.#view.refEndHour.value,
                    this.#view.refEndMinutes.value
                );

                if (dateSerial <= this.#timeSlotData.StartDateTimeSerial) {
                    dateSerial += 86400000;
                }

                this.#timeSlotData.EndDateTimeSerial = dateSerial;

                this.#timeEventManager.uiTimeInfoChanged({
                    object: this,
                    field: "endTime",
                    value: this.#timeSlotData
                });
        }
    }

    get viewRoot() {
        return this.#view.refRoot;
    }

    get timeSlotData() {
        return this.#timeSlotData;
    }
}
