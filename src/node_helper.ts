import * as oebb from 'oebb-api';
import { GET_STATION_DATA, RECEIVED_STATION_DATA } from './constants/ModuleNotifications';

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({
    socketNotificationReceived(notification: string, payload: any): void {
        switch(notification) {
            case GET_STATION_DATA:
                this._fetchStationData(payload);
        }
    },

    _fetchStationData(stationNumber: number) {
        const options = {
            ...oebb.getStationBoardDataOptions(),
            evaId: stationNumber,
        };

        oebb.getStationBoardData(options)
            .then((stationResponse) => {
                this.sendSocketNotification(RECEIVED_STATION_DATA, stationResponse);
            });
    }
});
