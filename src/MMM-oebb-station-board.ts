import { GET_STATION_DATA, RECEIVED_STATION_DATA } from './constants/ModuleNotifications';
import store from './services/Store';
import Config from './types/Config';
import DomTree, { RowTemplate } from './types/DomTree';
import StationData from './types/StationData';

const DOM_INSTANCES: { [key: string]: DomTree } = {};

Module.register<Config>('MMM-oebb-station-board', {
    /**
     * Define the default instance config
     */
    defaults: {
        boardType: 'dep',
        maxConnections: 8,
    },

    start() {
        store.onUpdate(() => this.renderDom());
        this._fetchStationData();
    },

    /**
     * Core-Function to return the modules DOM-Tree.
     */
    getDom(): HTMLElement {
        this.renderDom();
        return this._getDomInstance().root;
    },

    renderDom() {
        const { root, header, table, createRow } = this._getDomInstance() as DomTree;
        const data = store.stationData;

        if (store.loading) {
            header.innerText = 'Loading station data …';
        } else if (!data) {
            header.innerText = 'No data available!';
            table.innerHTML = '';
        } else {
            header.innerText = data.stationName;
            table.innerHTML = '';
            table.append(...data.journey.map((train) => {
                const { row, time, timeCorrection, id, destination, platform } = createRow();

                time.innerText = train.ti;
                id.innerText = train.pr;
                destination.innerText = train.lastStop;
                platform.innerText = train.tr;

                if (train.rt) {
                    timeCorrection.innerText = train.rt.dlt;
                }

                return row;
            }))
        }
    },

    socketNotificationReceived(notification: string, payload: any) {
        switch (notification) {
            case RECEIVED_STATION_DATA:
                store.stationData = payload as StationData;
                store.loading = false;
                this._setupRefreshTimeout();
                break;
        }
    },

    _getDomInstance(): DomTree {
        const { identifier } = this;

        // Create DOM Elements only if not created before.
        if (!DOM_INSTANCES[identifier]) {
            const root = document.createElement<'div'>('div');
            const header = document.createElement<'header'>('header');
            const table = document.createElement<'table'>('table');

            const createRow = (): RowTemplate => {
                const row = document.createElement<'tr'>('tr');
                const time = document.createElement<'td'>('td');
                const timeCorrection = document.createElement<'td'>('td');
                const id = document.createElement<'td'>('td');
                const destination = document.createElement<'td'>('td');
                const platform = document.createElement<'td'>('td');

                row.append(time, timeCorrection, id, destination, platform);

                return {
                    row,
                    time,
                    timeCorrection,
                    id,
                    destination,
                    platform,
                }
            };

            root.append(header, table);

            DOM_INSTANCES[identifier] = {
                root,
                header,
                table,
                createRow,
            };
        }

        return DOM_INSTANCES[identifier];
    },

    _fetchStationData() {
        store.loading = true;
        this.sendSocketNotification(GET_STATION_DATA, this.config);
    },

    _setupRefreshTimeout() {
        let timeout = 15 * 60 * 1000;

        if (store.stationData) {
            const nextJourneyDate = store.stationData.journey.reduce((nextTime: null | Date, journey) => {
                const [hours, minutes] = journey.ti.split(':');
                const [day, month, year] = journey.da.split('.');
                const date = new Date(`${year}-${month}-${day} ${hours}:${minutes}:00`);

                if (!nextTime) {
                    return date;
                } else if (nextTime < date) {
                    return nextTime;
                }

                return date;
            }, null);

            if (nextJourneyDate) {
                const diff = Math.abs(+nextJourneyDate - +new Date());
                timeout = timeout < diff ? timeout : diff;
            }
        }

        setTimeout(() => {
            this._fetchStationData();
        }, timeout);
    },
});
