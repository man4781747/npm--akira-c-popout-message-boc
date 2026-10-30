import { App } from 'vue';
import { default as PopoutMessagePlugin, usePopoutMessage } from '../src/components/popoutMessageBox/PopoutMessagePlugin';
export { PopoutMessagePlugin, usePopoutMessage };
export { notify } from '../src/components/popoutMessageBox/popoutMessageCore';
export type { PopoutMessageMethods } from '../src/components/popoutMessageBox/popoutMessageService';
export type { MessageType, PopoutMessageCore, PopoutMessageListener, PopoutMessageState, } from '../src/components/popoutMessageBox/popoutMessageCore';
declare const _default: {
    install: (App: App) => void;
    usePopoutMessage: typeof usePopoutMessage;
};
export default _default;
