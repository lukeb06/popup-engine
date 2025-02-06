import { Overlay, CloseableOverlay } from './overlay';

export type ButtonT = {
    text: string;
    variant?: 'primary' | 'outline';
    onClick: () => void;
};

export type FormT =
    | {
          input?: {
              key: string;
              type: string;
              label: string;
              required?: boolean;
          };
          select?: {
              key: string;
              options: string[];
          };
          radio?: {
              key: string;
              options: string[];
          };
          dropdown?: {
              key: string;
              options: string[];
              placeholder: string;
              required?: boolean;
          };
          textarea?: {
              key: string;
              placeholder: string;
          };
          img?: string;
          title?: string;
          header?: string;
          subheader?: string;
      }
    | 'br';

export class Popup {
    static zIndex = 99999999999999;

    content: string | HTMLElement;
    uid: string;
    el: HTMLDivElement;
    style: string;
    styleEl: HTMLStyleElement;
    overlay: Overlay;

    contentEl: HTMLDivElement;
    buttonsWrapper: HTMLDivElement | undefined;

    constructor(
        content: string | HTMLElement | HTMLElement[],
        overlay: Overlay = new CloseableOverlay(),
        buttons?: ButtonT[],
        padding: string = '1rem',
    ) {
        if (typeof content === 'string') this.content = content;
        else if (content instanceof HTMLElement) this.content = content;
        else if (content instanceof Array) {
            this.content = document.createElement('div');
            this.content.append(...content);
        } else {
            throw new Error('Invalid content type');
        }

        this.uid = 'U' + (Date.now() + Math.random()).toString(16).replaceAll('.', '');
        this.el = document.createElement('div');
        this.el.classList.add('POPUP', this.uid);
        setTimeout(() => {
            this.el.classList.add('visible');
        }, 5);

        this.el.style.display = 'flex';
        this.el.style.flexDirection = 'column';
        this.el.style.gap = '1rem';

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
                const variant = button.variant || 'primary';
                buttonEl.classList.add('POPUP-BUTTON', variant);
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
                transform: translate(-50%, -60%);
                opacity: 0;
                pointer-events: none;
                background-color: white;
                border-radius: 0.5rem;
                padding: ${padding};
                box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2);
                max-width: 95vw;
                max-height: 90vh;
                transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
            }

            .${this.uid}.visible {
                opacity: 1;
                pointer-events: initial;
                transform: translate(-50%, -50%);
            }

            .${this.uid} .POPUP-BUTTONS {
                display: flex;
                flex-direction: row;
                justify-content: center;
                gap: 0.5rem;
                align-items: center;
            }

            .${this.uid} .POPUP-BUTTON {
                padding: 0.5rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
            }

            .${this.uid} .POPUP-BUTTON.primary {
                border: solid 1px #379c44;
                background-color: #379c44;
                color: white;
            }

            .${this.uid} .POPUP-BUTTON.outline {
                border: solid 1px rgba(0, 0, 0, 0.3);
                background-color: transparent;
                color: #333;
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

    append(el: HTMLElement) {
        this.contentEl.append(el);
    }

    remove() {
        this.el.remove();
        this.styleEl.remove();
        this.overlay.remove();
    }
}

type FormMapT = Map<string, string | string[]>;
type CallbackT = (data: FormMapT) => void;

export class FormPopup extends Popup {
    formEl: HTMLFormElement;
    eventCallbacks: Map<string, CallbackT>;

    constructor(content: FormT[], overlay: Overlay = new CloseableOverlay(), buttons?: ButtonT[]) {
        super('', overlay, buttons);

        this.formEl = document.createElement('form');
        this.formEl.classList.add('POPUP-FORM');
        this.append(this.formEl);

        this.eventCallbacks = new Map();

        content.forEach(item => {
            if (typeof item === 'string') {
                if (item === 'br')
                    new Array(1)
                        .fill(0)
                        .map(() => document.createElement('br'))
                        .forEach(v => this.formEl.append(v));
            } else {
                if (item.input) {
                    const el = document.createElement('fancy-input');

                    el.setAttribute('key', item.input.key);
                    el.setAttribute('type', item.input.type);
                    el.setAttribute('label', item.input.label);
                    if (item.input.required) el.setAttribute('required', '');

                    this.formEl.append(el);
                }

                if (item.select) {
                    const el = document.createElement('fancy-select');

                    el.setAttribute('key', item.select.key);
                    el.setAttribute('options', item.select.options.join(','));

                    this.formEl.append(el);
                }

                if (item.radio) {
                    const el = document.createElement('fancy-radio');

                    el.setAttribute('key', item.radio.key);
                    el.setAttribute('options', item.radio.options.join(','));

                    this.formEl.append(el);
                }

                if (item.dropdown) {
                    const el = document.createElement('fancy-dropdown');

                    el.setAttribute('key', item.dropdown.key);
                    el.setAttribute('options', item.dropdown.options.join(','));
                    el.setAttribute('placeholder', item.dropdown.placeholder);
                    if (item.dropdown.required) el.setAttribute('required', '');

                    this.formEl.append(el);
                }

                if (item.textarea) {
                    const el = document.createElement('fancy-textarea');

                    el.setAttribute('key', item.textarea.key);
                    el.setAttribute('placeholder', item.textarea.placeholder);

                    this.formEl.append(el);
                }

                if (item.title) {
                    const h2 = document.createElement('h2');
                    h2.innerText = item.title;
                    h2.style.marginTop = '0';
                    h2.style.fontSize = '2.7rem';
                    h2.style.textAlign = 'center';
                    h2.style.maxWidth = '400px';
                    this.formEl.append(h2);
                }

                if (item.img) {
                    const img = document.createElement('img');
                    img.src = item.img;
                    img.style.width = '30%';
                    img.style.height = 'auto';
                    this.formEl.append(img);
                }

                if (item.header) {
                    const h3 = document.createElement('h3');
                    h3.innerText = item.header;
                    h3.style.margin = '0';
                    h3.style.textAlign = 'center';
                    h3.style.fontSize = '2.2rem';
                    h3.style.maxWidth = '400px';
                    if (!item.subheader) h3.style.marginBottom = '1rem';
                    this.formEl.append(h3);
                }

                if (item.subheader) {
                    const h4 = document.createElement('h4');
                    h4.innerText = item.subheader;
                    h4.style.margin = '0';
                    h4.style.marginBottom = '1rem';
                    h4.style.textAlign = 'center';
                    h4.style.maxWidth = '400px';
                    this.formEl.append(h4);
                }
            }
        });

        const submitBtn = document.createElement('button');
        submitBtn.innerText = 'submit';
        submitBtn.style.display = 'none';
        this.formEl.appendChild(submitBtn);
    }

    on(event: string, callback: CallbackT) {
        this.eventCallbacks.set(event, callback);
    }

    setupEventListeners() {
        this.formEl.addEventListener('submit', e => {
            e.preventDefault();
            const formData = new FormData(this.formEl);
            const formMap: FormMapT = new Map();

            formData.forEach((value, key) => {
                if (typeof value !== 'string') return;
                if (formMap.has(key)) {
                    const v = formMap.get(key);
                    if (v instanceof Array) {
                        formMap.set(key, [...v, value]);
                    } else if (typeof v === 'string') {
                        formMap.set(key, [v, value]);
                    } else {
                        return;
                    }
                } else {
                    formMap.set(key, value);
                }
            });

            const cb = this.eventCallbacks.get('submit');
            if (!cb) return console.log(formMap);
            cb(formMap);
        });
    }
}
