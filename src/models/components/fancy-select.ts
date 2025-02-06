export class FancySelect extends HTMLElement {
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

        this.style.display = 'flex';
        this.style.flexFlow = 'wrap';
        this.style.gap = '1rem';
        this.style.justifyContent = 'center';

        this.innerHTML = '';
        this.options.forEach(option => {
            let text = option;
            if (!text) return console.error('option text is required');
            let name = text.replaceAll(' ', '-').replaceAll('&', 'and').toLowerCase();

            let elCheckbox = document.createElement('input');

            elCheckbox.type = 'checkbox';
            if (!this.key) throw new Error('key attribute is required');
            elCheckbox.name = this.key;
            elCheckbox.id = name;
            elCheckbox.className = 'fancy-checkbox';
            elCheckbox.setAttribute('value', text);
            elCheckbox.style.display = 'none';

            let elLabel = document.createElement('label');

            elLabel.textContent = text;
            elLabel.setAttribute('for', name);

            elLabel.style.display = 'grid';
            elLabel.style.placeItems = 'center';
            elLabel.style.whiteSpace = 'nowrap';
            elLabel.style.padding = '0.8rem 1.2rem';
            elLabel.style.border = 'solid 1px rgba(0, 0, 0, 0.3)';
            elLabel.style.borderRadius = '999px';
            elLabel.style.userSelect = 'none';
            elLabel.style.cursor = 'pointer';
            elLabel.style.fontSize = '1.2rem';

            let s = document.createElement('style');
            s.innerHTML = `
                .fancy-checkbox + label {
                    transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, border-color 0.15s ease-in-out;
                }

                .fancy-checkbox:checked + label {
                    background-color: #379c44;
                    color: white;
                    border-color:transparent !important;
                }

                @media (min-width: 990px) {
                    .fancy-checkbox:hover + label {
                        background-color: #379c4455;
                        color: white;
                        border-color:transparent !important;
                    }
                    
                    .fancy-checkbox:hover:checked + label {
                        background-color: #379c44cc;
                        color: white;
                        border-color:transparent !important;
                    }
                }
            `;

            let wrapper = document.createElement('div');

            wrapper.appendChild(s);
            wrapper.appendChild(elCheckbox);
            wrapper.appendChild(elLabel);

            this.appendChild(wrapper);
        });
    }
}
