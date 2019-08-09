declare module 'oebb-api' {

    // Type definitions for oebb-api 1.0
    // Project: https://github.com/mymro/oebb-api#readme
    // Definitions by: Michael Scharl <https://github.com/mscharl>
    // Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

    export interface StationNew {
        latitude: number;
        longitude: number;
        meta: string;
        name: string;
        number: number;
    }

    export interface StationSearchOptions {
        js: boolean;
        REQ0JourneyStopsB: number;
        REQ0JourneyStopsS0A: number;
        S: string;
    }

    export interface Station {
        extId: string;
        id: string;
        prodClass: string;
        state: string;
        type: string;
        typeStr: string;
        value: string;
        weight: string;
        xcoord: string;
        ycoord: string;
    }

    export type StationBoardType = 'dep' | 'arr';

    export interface StationBoardDataOptions {
        additionalTime: number;
        boardType: StationBoardType;
        dateBegin: string;
        dateEnd: string;
        dirInput: number;
        evaId: number;
        L: string;
        maxJourneys: number;
        outputMode: string;
        productsFilter: string;
        selectDate: string;
        start: 'yes' | 'no';
        time: string;
    }

    export interface StationBoardDataJourney {
        ati: string;
        da: string;
        id: string;
        lastStop: string;
        pr: string;
        rt: false | {
            status: string;
            dlm: string;
            dlt: string;
            dld: string;
        };
        rta: false | {
            status: string;
            dlm: string;
            dlt: string;
        };
        st: string;
        ti: string;
        tr: string;
        trChg: boolean;
    }

    export interface StationBoardData {
        boardType: StationBoardType;
        headTexts: string[];
        iconProductsSubPath: string;
        imgPath: string;
        journey: StationBoardDataJourney[];
        maxJ: number;
        stationName: string;
        stationEvaId: string;
    }

    export interface Journeys {
        connections: Array<{
            connection: {
                duration: number;
                from: {
                    departure: string
                    departurePlatform: string
                    esn: number;
                    name: string;
                    showAsResolvedMetaStation: boolean;
                }
                id: string;
                sections: Array<{
                    category: {
                        assistantIconId: string;
                        backgroundColor: string;
                        backgroundColorDisabled: string
                        barColor: string;
                        barColorDisabled: string
                        displayName: string;
                        fontColor: string;
                        fontColorDisabled: string
                        longName: { [languageId: string]: string };
                        name: string;
                        number: string;
                        place: { [languageId: string]: string };
                        train: boolean;
                    }
                    duration: number;
                    from: {
                        departure: string
                        departurePlatform: string
                        esn: number;
                        name: string;
                    }
                    hasRealtime: boolean;
                    to: {
                        arrival: string;
                        esn: number;
                        name: string;
                    }
                    type: string;
                }>
                switches: number;
                to: {
                    arrival: string
                    esn: number;
                    name: string;
                    showAsResolvedMetaStation: boolean;
                }
            };
            offer: {
                availabilityState: string;
                connectionId: string;
                firstClass: boolean;
                offerError: boolean;
                price: number;
            };
        }>;
    }

    export interface DelayedStationBoardDataJourneys {
        delayed: StationBoardDataJourney[];
        canceled: StationBoardDataJourney[];
    }

    export function searchStationsNew(name: string): Promise<StationNew[]>;

    export function searchStations(options: StationSearchOptions): Promise<Station[]>;

    export function getStationSearchOptions(): StationSearchOptions;

    export function getStationBoardData(options: StationBoardDataOptions): Promise<StationBoardData>;

    export function getStationBoardDataOptions(): StationBoardDataOptions;

    export function getJourneys(from: StationNew, to: StationNew, add_offers?: boolean, date?: any): Promise<Journeys>;

    export function getDelayed(stationInfo: StationBoardData): DelayedStationBoardDataJourneys;


}
