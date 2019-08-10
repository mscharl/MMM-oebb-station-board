import { getStationBoardData, getStationBoardDataOptions, StationBoardDataOptions } from 'oebb-api';
import { GET_STATION_DATA, RECEIVED_STATION_DATA } from './constants/ModuleNotifications';
import Config, { ConnectionTypes } from './types/Config';

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    socketNotificationReceived(notification: string, payload: any): void {
        switch (notification) {
            case GET_STATION_DATA:
                this._fetchStationData(payload);
        }
    },

    _fetchStationData(config: Config) {
        const { boardType, direction, maxConnections, stationNumber, connectionTypes } = config;
        const options: StationBoardDataOptions = {
            ...getStationBoardDataOptions(),
            ...(direction ? { dirInput: direction } : {}),
            ...(connectionTypes ? { productsFilter: this._createConnectionTypeFilter(connectionTypes) } : {}),
            evaId: stationNumber,
            boardType,
            maxJourneys: maxConnections,
        };

        getStationBoardData(options)
            .then((stationResponse) => {
                this.sendSocketNotification(RECEIVED_STATION_DATA, stationResponse);
            });
    },

    _createConnectionTypeFilter(types: ConnectionTypes): string {
        return [
            types.Railjet,
            false,
            types.ECandICE,
            types.DandEuronightAndNightjet,
            types.Regional,
            types.SBahn,
            types.Bus,
            false,
            types.Subway,
            types.Tram,
            false,
            types.AST,
            types.Westbahn,
            false,
            false,
            false,
        ].map((flag) => flag ? '1' : '0').join('');
    },
});
