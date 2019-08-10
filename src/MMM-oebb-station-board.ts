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
        maxConnections: 4,
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
        const { root, header, table, createRow, spaceRow } = this._getDomInstance() as DomTree;
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
                const { row, currentTime, plannedTime, id, destination, platform } = createRow();

                currentTime.innerText = train.ti;
                id.innerText = train.pr;
                destination.innerText = train.lastStop;
                platform.innerText = train.tr;

                if (train.rt) {
                    currentTime.innerText = train.rt.dlt;
                    currentTime.style.color = 'red';
                    plannedTime.innerText = train.ti;
                }

                return row;
            }).reduce((rows, row, index) => [
                ...rows,
                ...(index === 0 ? [] : [spaceRow()]),
                row,
            ], [] as HTMLElement[]))
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

            table.classList.add('align-left');

            const spaceRow = (): HTMLElement => {
                const row = document.createElement<'tr'>('tr');
                const col = document.createElement<'td'>('td');
                const hr = document.createElement<'hr'>('hr');

                col.colSpan = 3;
                hr.classList.add('dimmed');
                hr.style.borderWidth = '0 0 1px 0';
                hr.style.borderStyle = 'solid';
                hr.style.borderColor = 'currentColor';
                hr.style.margin = '.1875em 0';

                row.append(col);
                col.append(hr);

                return row;
            };
            const createRow = (): RowTemplate => {
                const row = document.createElement<'tr'>('tr');
                const time = document.createElement<'td'>('td');
                const currentTime = document.createElement<'div'>('div');
                const plannedTime = document.createElement<'div'>('div');
                const trainInfo = document.createElement<'td'>('td');
                const id = document.createElement<'div'>('div');
                const destination = document.createElement<'div'>('div');
                const platform = document.createElement<'td'>('td');

                currentTime.classList.add('medium');
                currentTime.classList.add('bright');
                currentTime.classList.add('light');

                plannedTime.classList.add('xsmall');

                time.style.paddingRight = '.375em';
                time.style.verticalAlign = 'bottom';
                time.append(currentTime, plannedTime);

                id.classList.add('small');
                id.classList.add('light');
                destination.classList.add('small');
                destination.classList.add('bright');
                platform.classList.add('small');
                platform.classList.add('align-right');
                platform.style.paddingLeft = '.625em';

                row.append(time, trainInfo, platform);
                trainInfo.append(id, destination);

                return {
                    row,
                    currentTime,
                    plannedTime,
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
                spaceRow,
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
                const diff = Math.abs(+nextJourneyDate - +new Date()) + 30000; // Adding 30secs delay to avoid getting outdated data.
                timeout = timeout < diff ? timeout : diff;
            }
        }

        setTimeout(() => {
            this._fetchStationData();
        }, timeout);
    },
});
