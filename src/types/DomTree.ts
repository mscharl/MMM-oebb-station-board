export default interface DomTree {
    root: HTMLDivElement,
    header: HTMLElement,
    table: HTMLTableElement,
    createRow: () => RowTemplate,
    spaceRow: () => HTMLElement,
}

export interface RowTemplate {
    row: HTMLTableRowElement,
    currentTime: HTMLElement,
    plannedTime: HTMLElement,
    id: HTMLElement,
    destination: HTMLElement,
    platform: HTMLElement,
}
