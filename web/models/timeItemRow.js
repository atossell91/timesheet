import { timeItemRowView } from "../compiled-views/timeItemRowView.js"
import { TimeSlotData } from "../services/TimeSlotData.js"
import { createDateSerial } from "../services/Utilities.js";
import { formatDateISO } from "../services/Utilities.js";

export class timeItemRow {
    #view;
    #timeEventManager;
    #timeSlotData;
    #rowId;
    #lookupData;

    #hourFromSerial(serial) {
        const dt = new Date(serial);
        return dt.getHours();
    }

    #minutesFromSerial(serial) {
        const dt = new Date(serial);
        return dt.getMinutes();
    }

    #dateFromSerial(serial) {
        return formatDateISO(serial);
    }

    #updateUI() {
        this.#view.refTimeSlotDate.value = formatDateISO(this.#timeSlotData.WorkDateTimeSerial);
        this.#view.refStartHour.value = this.#hourFromSerial(this.#timeSlotData.StartDateTimeSerial);
        this.#view.refStartMinutes.value = this.#minutesFromSerial(this.#timeSlotData.StartDateTimeSerial);

        this.#view.refEndHour.value = this.#hourFromSerial(this.#timeSlotData.EndDateTimeSerial);
        this.#view.refEndMinutes.value = this.#minutesFromSerial(this.#timeSlotData.EndDateTimeSerial);

        this.#view.refLunchBreak.checked = this.#timeSlotData.LunchBreak;
        this.#view.refLunchDelivered.checked = this.#timeSlotData.LunchDelivered;

        this.#view.refResponse.value = this.#timeSlotData.Response;
    }

    constructor(rowId, lookupData, timeEventManager, responses) {
        this.#rowId = rowId;
        this.#lookupData = lookupData;
        this.#view = new timeItemRowView();
        this.#timeEventManager = timeEventManager;
        this.#lookupData.get(this.#rowId).then((res)=>{
            const data = res.clone();
            this.#timeSlotData = data;

            this.#setResponseOptions(responses);
            this.#updateUI();
        });
        this.#timeEventManager.addEventListener("dataChanged", (data)=>{
            if (data.detail.id !== this.#rowId) return;
            this.#updateUI();
        });

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
            this.#timeSlotData.Response = this.#view.refResponse.value;
            this.#timeEventManager.uiDataUpdateRequested(
                this.#rowId, "response", this.#timeSlotData);

        });

        this.#view.refTimeSlotDate.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
        });

        this.#view.refLunchBreak.addEventListener("change", ()=>{
            this.#timeSlotData.LunchBreak = this.#view.refLunchBreak.checked;
            this.#timeEventManager.uiDataUpdateRequested(
                this.#rowId, "lunchBreak", this.#timeSlotData);
        });

        this.#view.refLunchDelivered.addEventListener("change", ()=>{
            this.#timeSlotData.LunchDelivered = this.#view.refLunchDelivered.checked;
            this.#timeEventManager.uiDataUpdateRequested(
                this.#rowId, "lunchDelivered", this.#timeSlotData);
        });

        this.#view.refDeleteRow.addEventListener("click", ()=>{
            this.#timeEventManager.uiDataRemoveRequested(this.#rowId);
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

                this.#timeEventManager.uiDataUpdateRequested(
                    this.#rowId, "startTime", this.#timeSlotData);
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

                this.#timeEventManager.uiDataUpdateRequested(
                    this.#rowId, "endTime", this.#timeSlotData);
        }
    }

    get viewRoot() {
        return this.#view.refRoot;
    }

    get timeSlotData() {
        return this.#timeSlotData;
    }
}
