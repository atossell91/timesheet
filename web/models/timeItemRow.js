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
            this.#timeEventManager.timeSlotInfoChanged({
                object: this,
                field: "response",
                value: this.#view.refResponse.value
            });
        });

        this.#view.refTimeSlotDate.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
        });
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

                this.#timeEventManager.timeSlotInfoChanged({
                    object: this,
                    field: "startTime",
                    value: dateSerial
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

                if (dateSerial <= this.#timeSlotData.EndDateTimeSerial) {
                    dateSerial += 86400000;
                }

                this.#timeSlotData.EndDateTimeSerial = dateSerial;

                this.#timeEventManager.timeSlotInfoChanged({
                    object: this,
                    field: "endTime",
                    value: dateSerial
                });
        }
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
