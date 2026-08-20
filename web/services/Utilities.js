export function createDateSerial(dateStr, hour, min) {
    const fullStr = `${dateStr} ${hour}:${min}:00`
    const date = new Date(fullStr);
    return Math.floor(date);
}

export function formatDateISO(dateSerial) {
    const date = new Date(dateSerial);
    const year = ("" + date.getFullYear()).padStart(4, 0);
    const month = ("" + (date.getMonth()+1)).padStart(2, 0);
    const day = ("" + date.getDate()).padStart(2, 0);
    return `${year}-${month}-${day}`;
}
