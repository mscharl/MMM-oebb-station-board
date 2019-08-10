export interface ConnectionTypes {
    Railjet?: boolean;
    ECandICE?: boolean;
    DandEuronightAndNightjet?: boolean;
    Regional?: boolean;
    SBahn?: boolean;
    Bus?: boolean;
    Subway?: boolean;
    Tram?: boolean;
    Westbahn?: boolean;
    AST?: boolean;
}

export default interface Config {
    stationNumber: number;
    direction?: number;
    boardType: 'dep' | 'arr';
    maxConnections: number;
    connectionTypes?: ConnectionTypes;
}
