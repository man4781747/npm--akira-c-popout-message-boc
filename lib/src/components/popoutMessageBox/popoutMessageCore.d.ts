export type MessageType = 'success' | 'fail' | 'info' | 'warning' | 'primary' | 'debug';
export interface PopoutMessageState {
    /** 目前顯示中（尚未開始關閉）的訊息數 */
    count: number;
    /** 同時顯示的訊息上限 */
    maxItemNumber: number;
}
export type PopoutMessageListener = (state: PopoutMessageState) => void;
export interface PopoutMessageCore {
    success: (mainString: string, despString?: string, lifeTime?: number) => void;
    error: (mainString: string, despString?: string, lifeTime?: number) => void;
    info: (mainString: string, despString?: string, lifeTime?: number) => void;
    warning: (mainString: string, despString?: string, lifeTime?: number) => void;
    debug: (mainString: string, despString?: string, lifeTime?: number) => void;
    primary: (mainString: string, despString?: string, lifeTime?: number) => void;
    setMaxItemNumber: (max: number) => void;
    getMaxItemNumber: () => number;
    getCount: () => number;
    /** 狀態變化時呼叫 listener，回傳取消訂閱的函數 */
    subscribe: (listener: PopoutMessageListener) => () => void;
}
/** 通知服務（單例），所有入口共用同一份狀態 */
export declare const notify: PopoutMessageCore;
