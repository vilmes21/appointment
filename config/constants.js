module.exports = {
    slotType: {
        booked: "BOOKED",
        outOfOffice: "OUT_OF_OFFICE"
    }, //TODO: maybe later change to ints
    DEFAULT_APPOINTMENT_STATUS: 304,
    APPOINTMENT_STATUS_BOOKED: 304,
    APPOINTMENT_STATUS_CANCELLED: 301,
    ROLE_ADMIN: 201,
    //below can change according to business needs
    USER_PREVIEW_DAYS: 14,
    UNAVAILABLE_SLOT_TITLE: "Dr does NOT work now",
    MAX_APPTS_PER_DAY: 333, /* fake 30, make it 3 or something */
    KEY_DAY_FORMAT : 'YYYY-MM-DD'
    // Fake: {
    //     DR_ID: 210 //vic in local db
    // }
}