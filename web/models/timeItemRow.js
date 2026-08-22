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

    #setSlotDate(dateSerial) {
        this.#timeSlotData.StartDateTimeSerial = dateSerial;
        this.#view.refTimeSlotDate.value = formatDateISO(dateSerial);
    }

    #setStartHour(dateSerial) {
        const dt = new Date(dateSerial);
        this.#timeSlotData.StartDateTimeSerial = dateSerial;
        this.#view.refStartHour.value = dt.getHours();
    }

    #setStartMinue(dateSerial) {
        const dt = new Date(dateSerial);
        this.#timeSlotData.StartDateTimeSerial = dateSerial;
        this.#view.refStartMinutes.value = dt.getMinutes();
    }

    #setStartDateTime(dateSerial) {
        this.#timeSlotData.StartDateTimeSerial = dateSerial;

        const dt = new Date(dateSerial);
        this.#view.refStartMinutes.value = dt.getMinutes();
        this.#view.refStartHour.value = dt.getHours();
        this.#view.refTimeSlotDate = formatDateISO(dateSerial);
    }

    #setEndDateTime(dateSerial) {
        this.#timeSlotData.EndDateTimeSerial = dateSerial;

        const dt = new Date(dateSerial);
        this.#view.refEndMinutes.value = dt.getMinutes();
        this.#view.refEndHour.value = dt.getHours();
        this.#view.refTimeSlotDate = formatDateISO(dateSerial);
    }

    #setEndHour(dateSerial) {
        const dt = new Date(dateSerial);
        this.#timeSlotData.EndDateTimeSerial = dateSerial;
        this.#view.refEndtHour.value = dt.getHours();
    }

    #setEndMinute(dateSerial) {
        const dt = new Date(dateSerial);
        this.#timeSlotData.EndDateTimeSerial = dateSerial;
        this.#view.refEndMinutes.value = dt.getMinutes();
    }

    #setLunchBreak(lunch) {
        this.#timeSlotData.LunchBreak = lunch;
        this.#view.refLunchBreak.checked = lunch;
    }

    #setLunchDelivered(delivered) {
        this.#timeSlotData.LunchDelivered;
        this.#view.refLunchDelivered.checked = delivered;
    }

    #setResponse(response) {
        this.#timeSlotData.Response;
        this.#view.refResponse.value = response;
    }

    constructor(rowId, lookupData, timeEventManager, dateSerial, responses) {
        this.#rowId = rowId;
        this.#lookupData = lookupData;
        this.#view = new timeItemRowView();
        this.#timeEventManager = timeEventManager;
        this.#timeSlotData = new TimeSlotData();

        this.#timeEventManager.addEventListener("dataChanged", (data)=>{
            if (data.detail.id !== this.#rowId) return;

            this.#timeSlotData = this.#lookupData.get(id);

            this.#setStartDateTime(this.#timeSlotData.StartDateTimeSerial);
            this.#setEndDateTime(this.#timeSlotData.EndDateTimeSerial);

            this.#setLunchBreak(this.#timeSlotData.LunchBreak);
            this.#setLunchDelivered(this.#timeSlotData.LunchDelivered);

            this.#setResponse(this.#timeSlotData.Response);
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
