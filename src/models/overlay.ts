import { Popup } from './popup';

export class Overlay {
    static zIndex = 99999999999;

    opacity: number;
    blur: number;
    uid: string;
    el: HTMLDivElement;
    style: string;
    styleEl: HTMLStyleElement;
    parent?: Popup;

    constructor(opacity: number = 0.4, blur: number = 2) {
        this.opacity = opacity;
        this.blur = blur;
        this.uid = 'U' + (Date.now() + Math.random()).toString(16).replaceAll('.', '');
        this.el = document.createElement('div');
        this.el.classList.add('POPUP-OVERLAY', this.uid);
        this.style = `
            .${this.uid} {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: block !important;
                background-color: rgba(0, 0, 0, ${this.opacity});
                backdrop-filter: blur(${this.blur}px);
                z-index: ${Overlay.zIndex};
            }
        `;
        this.styleEl = document.createElement('style');
        this.styleEl.innerHTML = this.style;
    }

    setupEventListeners() { }

    appendTo(el: HTMLElement) {
        el.appendChild(this.styleEl);
        el.appendChild(this.el);
        this.setupEventListeners();
    }

    remove() {
        this.el.remove();
        this.styleEl.remove();
    }
}

export class CloseableOverlay extends Overlay {
    constructor(opacity: number = 0.4, blur: number = 2) {
        super(opacity, blur);
    }

    setupEventListeners() {
        this.el.addEventListener('click', () => {
            if (this.parent) this.parent.remove();
            else this.remove();
        });
    }
}
