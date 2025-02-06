export class FancyInput extends HTMLElement {
    key: string | null;
    type: string | null;
    label: string | null;
    required: boolean | null;

    constructor() {
        super();

        this.key = null;
        this.type = null;
        this.label = null;
        this.required = null;

        try {
            this.setup();
        } catch (e) {
            console.error(e);
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes') {
                    try {
                        this.setup();
                    } catch (e) {
                        console.error(e);
                    }
                }
            });
        });

        observer.observe(this, { attributes: true });
    }

    setup() {
        const getAttr = (attr: string) => {
            const attrV = this.getAttribute(attr);
            if (!attrV) throw new Error(`${attr} attribute is required`);
            return attrV;
        };

        this.key = getAttr('key');
        this.type = getAttr('type');
        this.label = getAttr('label');
        this.required = this.hasAttribute('required');

        if (!this.key || !this.type || !this.label) throw new Error('missing required attributes');

        this.innerHTML = '';

        const inputEl = document.createElement('input');
        inputEl.type = this.type;
        inputEl.required = this.required;
        inputEl.id = this.key;
        inputEl.name = this.key;
        inputEl.placeholder = '';
        inputEl.classList.add('fancy-input', 'empty');

        const placeholderEl = document.createElement('span');
        placeholderEl.innerText = this.label;
        placeholderEl.classList.add('fancy-input-placeholder');

        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            .fancy-input {
                width: 100%;
                border-radius: 0 !important;

                padding: 0.8rem 1.2rem;
                padding-left: 0;
                border: none;
                border-bottom: solid 2px rgba(0, 0, 0, 0.3);
                position: relative;
                background-color: transparent;
                font-size: 1.4rem;
                transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out, border-color 0.3s ease-in-out;
            }

            .fancy-input:focus-visible {
                border-color: #379c44 !important;
            }

            .fancy-input-placeholder {
                position: absolute;
                font-size: 1.4rem;
                pointer-events: none;
                user-select: none;
                inset: 0;
                align-items: center;
                left: 0;
                transition: transform 0.1s, font-size 0.1s, left 0.1s;
                display: none;
            }

            .fancy-input.empty + .fancy-input-placeholder {
                display: flex;
            }

            .fancy-input:focus-visible + .fancy-input-placeholder {
                display: flex;
                font-size: 1rem;
                left: 0;
                transform: translateY(-60%);
            }

            .fancy-input:focus-visible {
                box-shadow: none !important;
            }

            fancy-input {
                width: 100%;
                max-width: 400px;
                transition: margin-top 0.1s;
            }

            fancy-input:has(.fancy-input:focus-visible) {
                margin-top: 1.5rem;
            }
        `;

        const wrapperEl = document.createElement('div');
        wrapperEl.style.position = 'relative';

        wrapperEl.appendChild(inputEl);
        wrapperEl.appendChild(placeholderEl);
        this.appendChild(styleEl);
        this.appendChild(wrapperEl);

        if (this.required) {
            const requiredLabel = document.createElement('span');
            requiredLabel.innerText = '* Required';
            requiredLabel.style.color = 'red';
            requiredLabel.style.fontSize = '1.2rem';

            this.appendChild(requiredLabel);
        }

        inputEl.addEventListener('input', () => {
            if (inputEl.value.length === 0) {
                inputEl.classList.add('empty');
            } else {
                inputEl.classList.remove('empty');
            }
        });
    }
}
