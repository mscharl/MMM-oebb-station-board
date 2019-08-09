import debounce from 'debounce';
import StationData from '../types/StationData';

export default new class Store {
    private _loading: boolean = false;
    private _stationData: StationData | undefined;
    private _callbacks: Array<() => void> = [];

    private _update = debounce(() => this._callbacks.forEach((callback) => callback()), 50);

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
        this._update();
    }

    get stationData(): StationData | undefined {
        return this._stationData;
    }

    set stationData(value: StationData | undefined) {
        this._stationData = value;
        this._update();
    }

    onUpdate(callback: () => void) {
        this._callbacks.push(callback);
    }
}
