import { timeItemRowView } from "../compiled-views/timeItemRowView.js"
import { TimeSlotData } from "../services/TimeSlotData.js"
import { createDateSerial } from "../services/Utilities.js";
import { formatDateISO } from "../services/Utilities.js";

export class timeItemRow {
    #view;
    #timeEventManager;
    #timeSlotData;

    #dateComponent;
    #startMins;
    #startHour;
    #endMins;
    #endHour;

    constructor(timeEventManager, dateSerial, responses) {
        this.#view = new timeItemRowView();
        this.#timeEventManager = timeEventManager;
        this.#timeSlotData = new TimeSlotData();

        this.#view.refTimeSlotDate.value = formatDateISO(dateSerial);
        this.#setResponseOptions(responses);

        this.#view.refStartHour.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
            this.#timeEventManager.timeSlotInfoChanged();
        });

        this.#view.refStartMinutes.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
            this.#timeEventManager.timeSlotInfoChanged();
        });

        this.#view.refEndHour.addEventListener("change", ()=>{
            this.#calcEndDate();
            this.#timeEventManager.timeSlotInfoChanged();
        });

        this.#view.refEndMinutes.addEventListener("change", ()=>{
        this.#calcEndDate();
            this.#timeEventManager.timeSlotInfoChanged();
        });

        this.#view.refResponse.addEventListener("change", ()=>{
            this.#timeEventManager.timeSlotInfoChanged();
        });

        this.#view.refTimeSlotDate.addEventListener("change", ()=>{
            this.#trySetStartDateTime();
            this.#timeEventManager.timeSlotInfoChanged();
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
            this.#view.refStartMinutes.valeu !== "") {
                const dateSerial = createDateSerial(
                    this.#view.refTimeSlotDate.value,
                    this.#view.refStartHour.value,
                    this.#view.refEndMinutes.value
                );
                this.#timeSlotData.StartDateTimeSerial = dateSerial;
                this.#calcEndDate();
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
        }
    }

    get viewRoot() {
        return this.#view.refRoot;
    }
}
