import { App } from 'vue';
import { default as PopoutMessagePlugin, usePopoutMessage } from '../src/components/popoutMessageBox/PopoutMessagePlugin';
import { PopoutMessageOptions } from '../src/components/popoutMessageBox/popoutMessageCore';
export { PopoutMessagePlugin, usePopoutMessage };
export { notify } from '../src/components/popoutMessageBox/popoutMessageCore';
export type { PopoutMessageMethods } from '../src/components/popoutMessageBox/popoutMessageService';
export type { MessageHandle, MessageType, MessageUpdate, Position, PopoutMessageCore, PopoutMessageListener, PopoutMessageOptions, PopoutMessageState, } from '../src/components/popoutMessageBox/popoutMessageCore';
declare const _default: {
    install: (App: App, options?: PopoutMessageOptions) => void;
    usePopoutMessage: typeof usePopoutMessage;
};
export default _default;
