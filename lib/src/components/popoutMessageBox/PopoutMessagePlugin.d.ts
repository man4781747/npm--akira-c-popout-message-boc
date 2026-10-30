import { App, InjectionKey } from 'vue';
import { PopoutMessageMethods } from './popoutMessageService';
import { PopoutMessageOptions } from './popoutMessageCore';
export declare const PopoutMessageInjectionKey: InjectionKey<PopoutMessageMethods>;
declare const _default: {
    install: (app: App, options?: PopoutMessageOptions) => void;
};
export default _default;
/**
 * 自定義一個 Composition API Hook，名稱為 usePopoutMessage
 * 這個函數讓我們能在 setup() 中簡單地使用 popoutMessage 的功能
 *
 * 例如: 在 main.ts 中
 *
 * import { usePopoutMessage } from '@/components/popoutMessageBox/PopoutMessagePlugin'
 *
 * const $notify = usePopoutMessage()
 *
 * 這樣就能使用 $notify 來操作了
 *
 * @returns
 */
export declare function usePopoutMessage(): PopoutMessageMethods;
