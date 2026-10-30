export type MessageType = 'success' | 'error' | 'info' | 'warning' | 'debug' | 'primary';
export type Position = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export interface PopoutMessageOptions {
    /** 同時顯示的訊息上限，預設 10 */
    max?: number;
    /** 未指定 lifeTime 時的顯示秒數，預設 5；0 代表不自動關閉 */
    duration?: number;
    /** 顯示位置，預設 'top-right' */
    position?: Position;
}
export interface MessageUpdate {
    mainString?: string;
    despString?: string;
    type?: MessageType;
    /** 新的顯示秒數（0 代表不自動關閉）；不論是否指定，update 後都會重新計時 */
    lifeTime?: number;
}
export interface MessageHandle {
    /** 立即開始關閉這則訊息 */
    close: () => void;
    /** 修改這則訊息並重新計時；已開始關閉的訊息不會有任何變化 */
    update: (changes: MessageUpdate) => void;
}
export interface PopoutMessageState {
    /** 目前顯示中（尚未開始關閉）的訊息數 */
    count: number;
    /** 同時顯示的訊息上限 */
    maxItemNumber: number;
}
export type PopoutMessageListener = (state: PopoutMessageState) => void;
export interface PopoutMessageCore {
    /** lifeTime 單位為秒，省略時使用 duration 設定；0 代表不自動關閉 */
    success: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    error: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    info: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    warning: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    debug: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    primary: (mainString: string, despString?: string, lifeTime?: number) => MessageHandle;
    /** 關閉所有顯示中的訊息 */
    clear: () => void;
    /** 修改設定，只套用有傳入的欄位；不合法的值拋出 RangeError */
    configure: (options: PopoutMessageOptions) => void;
    getConfig: () => Required<PopoutMessageOptions>;
    setMaxItemNumber: (max: number) => void;
    getMaxItemNumber: () => number;
    getCount: () => number;
    /** 狀態變化時呼叫 listener，回傳取消訂閱的函數 */
    subscribe: (listener: PopoutMessageListener) => () => void;
}
/** 通知服務（單例），所有入口共用同一份狀態 */
export declare const notify: PopoutMessageCore;
