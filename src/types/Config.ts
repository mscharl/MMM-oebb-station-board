interface Config {
    stationNumber: number;
    direction?: number;
    boardType: 'dep' | 'arr';
    maxConnections: number;
}

export default Config;
