declare const count: import('vue').Ref<number, number>;
declare const maxItemNumber: import('vue').Ref<number, number>;
export declare const status: {
    count: import('vue').Ref<number, number>;
    maxItemNumber: import('vue').Ref<number, number>;
};
export interface PopoutMessageMethods {
    success: (mainString: string, despString?: string, lifeTime?: number) => void;
    error: (mainString: string, despString?: string, lifeTime?: number) => void;
    info: (mainString: string, despString?: string, lifeTime?: number) => void;
    warning: (mainString: string, despString?: string, lifeTime?: number) => void;
    debug: (mainString: string, despString?: string, lifeTime?: number) => void;
    primary: (mainString: string, despString?: string, lifeTime?: number) => void;
    setMaxItemNumber: (max: number) => void;
    getMaxItemNumber: () => number;
    status: {
        count: typeof count;
        maxItemNumber: typeof maxItemNumber;
    };
}
export declare const popoutMessage: PopoutMessageMethods;
export {};
