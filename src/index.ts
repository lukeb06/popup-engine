import { CloseableOverlay, Overlay } from './models/overlay';
import { Popup, type ButtonT } from './models/popup';

export function createPopup(
    content: string,
    closeable: boolean = true,
    buttons?: ButtonT[],
    padding?: string,
) {
    const overlay = closeable ? new CloseableOverlay() : new Overlay();
    const popup = new Popup(content, overlay, buttons, padding);
    popup.appendTo(document.body);
    return popup;
}
