declare type ModuleProperties<C = object> = {
    defaults?: Partial<C>,
    start?(): void,
    getHeader?(): string,
    getTemplate?(): string,
    getTemplateData?(): object,
    notificationReceived?(notification: string, payload: any, sender: object): void,
    socketNotificationReceived?(notification: string, payload: any): void,
    suspend?(): void,
    resume?(): void,
    getDom?(): HTMLElement,
    getStyles?(): string[],
    [key: string]: any,
};

declare const Module: {
    register<C>(moduleName: string, moduleProperties: ModuleProperties<C>): void;
};

declare const Log: {
    info(message?: any, ...optionalParams: any[]): void,
    log(message?: any, ...optionalParams: any[]): void,
    error(message?: any, ...optionalParams: any[]): void,
    warn(message?: any, ...optionalParams: any[]): void,
    group(groupTitle?: string, ...optionalParams: any[]): void,
    groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void,
    groupEnd(): void,
    time(timerName?: string): void,
    timeEnd(timerName?: string): void,
    timeStamp(timerName?: string): void,
};

declare type NodeHelperOptions = {
    init?(): void,
    start?(): void,
    stop?(): void,
    socketNotificationReceived?(notification: string, payload: any): void,
    [key: string]: any,
};

declare const NodeHelper: {
    create(options: NodeHelperOptions): void,
};
