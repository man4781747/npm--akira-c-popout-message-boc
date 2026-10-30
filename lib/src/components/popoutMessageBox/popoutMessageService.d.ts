import { MessageHandle, PopoutMessageOptions } from './popoutMessageCore';
declare const count: import('vue').Ref<number, number>;
declare const maxItemNumber: import('vue').Ref<number, number>;
export declare const status: {
    count: import('vue').Ref<number, number>;
    maxItemNumber: import('vue').Ref<number, number>;
};
export interface PopoutMessageMethods {
    success: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    error: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    info: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    warning: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    debug: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    primary: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    clear: () => void;
    configure: (options: PopoutMessageOptions) => void;
    setMaxItemNumber: (max: number) => void;
    getMaxItemNumber: () => number;
    status: {
        count: typeof count;
        maxItemNumber: typeof maxItemNumber;
    };
}
export declare const popoutMessage: PopoutMessageMethods;
export {};
