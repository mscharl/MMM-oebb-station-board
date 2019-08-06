export default interface StationData {
    stationName: string,
    journey: Array<{
        id: string,
        ti: string, // Departure Time
        da: string, // Departure Date
        pr: string, // Transport name
        lastStop: string, // Destination
        tr: string, // Platform
        trChg: boolean, // Platform did change
        rt: false | {
            status: string, // Current status
            dlm: string, // How many minutes late
            dlt: string, // Actual departure time
            dld: string, // Actual departure date
        },
    }>,
}
