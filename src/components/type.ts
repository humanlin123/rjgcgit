export interface MenuInstance {
    items: Item;
    event: any; // 拦截右键点击事件
    position: {
        x: number;
        y: number;
    };
    style: {
        minWidth?: number;
        width?: number;
        height?: number;
        hr?: boolean; // 分割线
        color?: string;
    };
    disabled?: boolean;
    x?: number;
    y?: number;
}

export interface SubmenuItem {
    label: string;
    icon?: string;
    onclick?: Function;
    disabled?: boolean;
    hr?: boolean;
}

export interface Item extends SubmenuItem {
    children?: SubmenuItem[];
}

export interface IColorObj {
    r: number;
    g: number;
    b: number;
    a?: number;
}
