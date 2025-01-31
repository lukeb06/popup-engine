import { Overlay, CloseableOverlay } from './overlay';

export type ButtonT = {
    text: string;
    onClick: () => void;
};

export class Popup {
    static zIndex = 99999999999999;

    content: string;
    uid: string;
    el: HTMLDivElement;
    style: string;
    styleEl: HTMLStyleElement;
    overlay: Overlay;

    contentEl: HTMLDivElement;
    buttonsWrapper: HTMLDivElement | undefined;

    constructor(content: string, overlay: Overlay = new CloseableOverlay(), buttons?: ButtonT[]) {
        this.content = content;
        this.uid = 'U' + (Date.now() + Math.random()).toString(16).replaceAll('.', '');
        this.el = document.createElement('div');
        this.el.classList.add('POPUP', this.uid);

        this.contentEl = document.createElement('div');
        this.contentEl.classList.add('POPUP-CONTENT');
        this.contentEl.append(this.content);
        this.el.append(this.contentEl);

        if (buttons && buttons.length > 0) {
            this.buttonsWrapper = document.createElement('div');
            this.buttonsWrapper.classList.add('POPUP-BUTTONS');
            this.el.append(this.buttonsWrapper);
            buttons.forEach(button => {
                const buttonEl = document.createElement('button');
                buttonEl.innerText = button.text;
                buttonEl.classList.add('POPUP-BUTTON');
                if (!this.buttonsWrapper) throw new Error('Buttons wrapper not found');
                this.buttonsWrapper.append(buttonEl);
                buttonEl.addEventListener('click', button.onClick);
            });
        }

        this.style = `
            .${this.uid} {
                position: fixed;
                top: 50%;
                left: 50%;
                z-index: ${Popup.zIndex};
                transform: translate(-50%, -50%);
                background-color: white;
                border-radius: 0.5rem;
                padding: 1rem;
                box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
                max-width: 50vw;
                max-height: 50vh;
            }

            .${this.uid} .POPUP-BUTTONS {
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 1rem;
                align-items: center;
            }
        `;
        this.styleEl = document.createElement('style');
        this.styleEl.innerHTML = this.style;
        this.overlay = overlay;
        this.overlay.parent = this;
    }

    setupEventListeners() {}

    appendTo(el: HTMLElement) {
        this.overlay.appendTo(el);
        el.appendChild(this.styleEl);
        el.appendChild(this.el);
        this.setupEventListeners();
    }

    remove() {
        this.el.remove();
        this.styleEl.remove();
        this.overlay.remove();
    }
}
