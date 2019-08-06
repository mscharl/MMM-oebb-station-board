import { GET_STATION_DATA, RECEIVED_STATION_DATA } from './constants/ModuleNotifications';
import Config from './types/Config';
import DomTree, { RowTemplate } from './types/DomTree';
import StationData from './types/StationData';

interface State {
    loading: boolean;
    data?: StationData;
}

const DOM_INSTANCES: { [key: string]: DomTree } = {};

Module.register<Config>('MMM-oebb-station-board', {
    /**
     * Define the default instance config
     */
    defaults: {},

    start() {
        this.loading = true;
        this.stationData = null;

        this.sendSocketNotification(GET_STATION_DATA, this.config.stationNumber);
    },

    /**
     * Core-Function to return the modules DOM-Tree.
     */
    getDom(): HTMLElement {
        const { root, header, table, createRow } = this._getDomInstance() as DomTree;
        const data = this.stationData as StationData;
        console.log(data);

        table.innerHTML = '';

        if (this.loading) {
            header.innerText = 'Loading station data …';
        } else if (!data) {
            header.innerText = 'No data available!';
        } else {
            header.innerText = data.stationName;
            table.append(...data.journey.map((train) => {
                const {row, time, timeCorrection, id, destination, platform} = createRow();

                time.innerText = train.ti;
                id.innerText = train.pr;
                destination.innerText = train.lastStop;
                platform.innerText = train.tr;

                if(train.rt) {
                    timeCorrection.innerText = train.rt.dlt;
                }

                return row;
            }))
        }

        return root;
    },

    socketNotificationReceived(notification: string, payload: any) {
        switch (notification) {
            case RECEIVED_STATION_DATA:
                this.stationData = payload as StationData;
                this.loading = false;
                this.updateDom();
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
});
