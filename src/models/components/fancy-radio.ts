export class FancyRadio extends HTMLElement {
    key: string | null;
    options: string[] | null;

    constructor() {
        super();
        this.key = null;
        this.options = null;

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
        this.options = getAttr('options').split(',');

        if (!this.key || !this.options) throw new Error('missing required attributes');

        this.innerHTML = '';
        this.options.forEach(option => {
            let text = option;
            if (!text) return console.error('option text is required');
            let name = text.replaceAll(' ', '-').replaceAll('&', 'and').toLowerCase();

            let radioEl = document.createElement('input');

            radioEl.type = 'radio';
            if (!this.key) throw new Error('key is required');
            radioEl.name = this.key;
            radioEl.id = name;
            radioEl.className = 'fancy-radio';
            radioEl.setAttribute('value', text);
            radioEl.style.display = 'none';

            let labelEl = document.createElement('label');

            labelEl.textContent = text;
            labelEl.setAttribute('for', name);

            labelEl.style.display = 'grid';
            labelEl.style.placeItems = 'center';
            labelEl.style.whiteSpace = 'nowrap';
            labelEl.style.padding = '0.8rem 1.2rem';
            labelEl.style.border = 'solid 1px rgba(0, 0, 0, 0.3)';
            labelEl.style.borderRadius = '999px';
            labelEl.style.userSelect = 'none';
            labelEl.style.cursor = 'pointer';
            labelEl.style.fontSize = '1.2rem';

            const transitionTime = 150;
            const clickTime = 100;
            const clickHold = 100;

            const transitionDelay = clickTime + clickHold;

            let s = document.createElement('style');
            s.innerHTML = `
                .fancy-radio + label {
                    transition: background-color ${transitionTime}ms ease-in-out, color ${transitionTime}ms ease-in-out, border-color ${transitionTime}ms ease-in-out, transform ${clickTime}ms;
                }

                @media (min-width: 990px) {
                    .fancy-radio:hover + label {
                        background-color: #379c4455;
                        color: white;
                        border-color:transparent !important;
                    }
                }

                .fancy-radio:checked + label {
                    transition: background-color ${transitionTime}ms ease-in-out ${transitionDelay}ms, color ${transitionTime}ms ease-in-out ${transitionDelay}ms, border-color ${transitionTime}ms ease-in-out ${transitionDelay}ms, transform ${clickTime}ms;
                    background-color: #379c44;
                    color: white;
                    border-color:transparent !important;
                }

                .fancy-radio + label.clicked {
                    transform: scale(0.95);
                }
            `;

            radioEl.addEventListener('input', () => {
                labelEl.classList.add('clicked');
                setTimeout(() => {
                    labelEl.classList.remove('clicked');
                }, transitionDelay);
            });

            let wrapper = document.createElement('div');

            wrapper.appendChild(s);
            wrapper.appendChild(radioEl);
            wrapper.appendChild(labelEl);

            this.appendChild(wrapper);

            this.style.display = 'flex';
            this.style.flexDirection = 'row';
            this.style.gap = '1rem';
            this.style.flexWrap = 'wrap';
            this.style.justifyContent = 'center';
        });
    }
}
