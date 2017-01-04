export function query<T extends Element>(selector: string): T {
    return <T>document.querySelector(selector);
}

export function queryAll<T extends Element>(selector: string): NodeListOf<T> {
    return <NodeListOf<T>>document.querySelectorAll(selector);
}

export function queryId<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
