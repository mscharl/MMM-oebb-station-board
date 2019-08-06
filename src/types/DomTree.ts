export default interface DomTree {
    root: HTMLDivElement,
    header: HTMLElement,
    table: HTMLTableElement,
    createRow: () => RowTemplate,
}

export interface RowTemplate {
    row: HTMLTableRowElement,
    time: HTMLTableDataCellElement,
    timeCorrection: HTMLTableDataCellElement,
    id: HTMLTableDataCellElement,
    destination: HTMLTableDataCellElement,
    platform: HTMLTableDataCellElement,
}
