export function Query<T extends Element>(selector: string, element?: Element): T {
    return <T>(element || document).querySelector(selector);
}

export function QueryAll<T extends Element>(selector: string, element?: Element): NodeListOf<T> {
    return <NodeListOf<T>>(element || document).querySelectorAll(selector);
}

export function QueryId<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}
