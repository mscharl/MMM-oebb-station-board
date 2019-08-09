import { getStationBoardData, getStationBoardDataOptions, StationBoardDataOptions } from 'oebb-api';
import { GET_STATION_DATA, RECEIVED_STATION_DATA } from './constants/ModuleNotifications';
import Config from './types/Config';

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    socketNotificationReceived(notification: string, payload: any): void {
        switch (notification) {
            case GET_STATION_DATA:
                const { boardType, direction, maxConnections, stationNumber } = payload as Config;
                this._fetchStationData(stationNumber, boardType, maxConnections, direction);
        }
    },

    _fetchStationData(stationNumber: number, boardType: Config['boardType'], maxConnections: number, direction?: number) {
        const options: StationBoardDataOptions = {
            ...getStationBoardDataOptions(),
            ...(direction ? { dirInput: direction } : {}),
            evaId: stationNumber,
            boardType,
            maxJourneys: maxConnections,
        };

        getStationBoardData(options)
            .then((stationResponse) => {
                this.sendSocketNotification(RECEIVED_STATION_DATA, stationResponse);
            });
    },
});
