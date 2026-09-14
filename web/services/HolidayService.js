export class HolidayService {
    #holidays = new Map();
    #holidayFuncs = new Map();

    constructor() {
        this.#holidayFuncs.set("New Year's Day", (year) => {
            return Math.floor(new Date(year, 0, 1).getTime());
        });

        this.#holidayFuncs.set("Good Friday", (year) => {
            const easter = this.#calculateEaster(year);
            easter.setDate(easter.getUTCDate() - 2);
            return Math.floor(easter.getTime());
        });

        this.#holidayFuncs.set("Easter Monday", (year) => {
            const easter = this.#calculateEaster(year);
            easter.setDate(easter.getUTCDate() + 1);
            return Math.floor(easter.getTime());
        });

        this.#holidayFuncs.set("Victoria Day", (year) => {
            // Monday on or preceding May 24
            const d = new Date(year, 4, 24);
            const day = d.getDay();
            const diff = d.getUTCDate() - day + (day === 0 ? -6 : 1);
            // If May 24 is a Monday, Victoria Day is May 24? Wait, "on or before May 24". 
            // Standard rule: Monday preceding or on May 24.
            const may24 = new Date(year, 4, 24);
            let targetDate = new Date(year, 4, 24);
            let dow = may24.getDay();
            let offset = dow === 1 ? 0 : (dow === 0 ? -6 : 1 - dow);
            if (dow === 0) offset = -6; // Sunday -> previous Monday? No, Sunday is before Monday. 
            // Let's use the clean arithmetic formula for Victoria Day:
            let d2 = new Date(year, 4, 24);
            while (d2.getDay() !== 1) {
                d2.setDate(d2.getUTCDate() - 1);
            }
            return Math.floor(d2.getTime());
        });

        this.#holidayFuncs.set("Canada Day", (year) => {
            return Math.floor(new Date(year, 6, 1).getTime());
        });

        this.#holidayFuncs.set("Civic Holiday", (year) => {
            // First Monday in August (statutory/provincial variant, but common)
            const d = new Date(year, 7, 1);
            while (d.getDay() !== 1) {
                d.setDate(d.getUTCDate() + 1);
            }
            return Math.floor(d.getTime());
        });

        this.#holidayFuncs.set("Labour Day", (year) => {
            // First Monday in September
            const d = new Date(year, 8, 1);
            while (d.getDay() !== 1) {
                d.setDate(d.getUTCDate() + 1);
            }
            return Math.floor(d.getTime());
        });

        this.#holidayFuncs.set("National Day for Truth and Reconciliation", (year) => {
            return Math.floor(new Date(year, 8, 30).getTime());
        });

        this.#holidayFuncs.set("Thanksgiving", (year) => {
            // Second Monday in October
            const d = new Date(year, 9, 1);
            let mondays = 0;
            while (true) {
                if (d.getDay() === 1) {
                    mondays++;
                    if (mondays === 2) break;
                }
                d.setDate(d.getUTCDate() + 1);
            }
            return Math.floor(d.getTime());
        });

        this.#holidayFuncs.set("Remembrance Day", (year) => {
            return Math.floor(new Date(year, 10, 11).getTime());
        });

        this.#holidayFuncs.set("Christmas Day", (year) => {
            return Math.floor(new Date(year, 11, 25).getTime());
        });

        this.#holidayFuncs.set("Boxing Day", (year) => {
            return Math.floor(new Date(year, 11, 26).getTime());
        });
    }

    #calculateEaster(year) {
        // Meeus/Jones/Butcher algorithm for Gregorian calendar easter calculation
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed months for JS Date
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month, day);
    }

    addHolidayFunc(holidayName, holidayFunc) {
        this.#holidayFuncs.set(holidayName, holidayFunc);
    }

    calcHolidays(year) {
        this.#holidays.clear();
        for (const [holidayName, func] of this.#holidayFuncs.entries()) {
            this.#holidays.set(func(year), holidayName);
        }
    }

    isHoliday(dateSerial) {
        return this.#holidays.has(dateSerial);
    }
}
