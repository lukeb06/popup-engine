export class FancyDropdown extends HTMLElement {
    key: string | null;
    options: string[] | null;
    placeholder: string | null;
    required: boolean | null;

    constructor() {
        super();

        this.key = null;
        this.options = null;
        this.placeholder = null;
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
        this.options = getAttr('options').split(',');
        this.placeholder = getAttr('placeholder');
        this.required = this.hasAttribute('required');

        if (!this.key || !this.options || !this.placeholder)
            throw new Error('missing required attributes');

        this.innerHTML = '';

        const selectEl = document.createElement('select');
        const cosmeticEl = document.createElement('div');

        selectEl.classList.add('fancy-dropdown');
        cosmeticEl.classList.add('fancy-dropdown-cosmetic');

        selectEl.name = this.key;
        selectEl.id = this.key;
        cosmeticEl.innerText = this.placeholder;

        cosmeticEl.style.gap = '1rem';
        cosmeticEl.style.padding = '0.8rem 1.2rem';
        cosmeticEl.style.paddingLeft = '0';
        cosmeticEl.style.border = 'none';
        cosmeticEl.style.borderBottom = 'solid 2px rgba(0, 0, 0, 0.3)';
        cosmeticEl.style.position = 'relative';
        cosmeticEl.style.fontSize = '1.4rem';
        cosmeticEl.style.userSelect = 'none';
        cosmeticEl.style.pointerEvents = 'none';
        cosmeticEl.style.width = '100%';

        selectEl.style.position = 'absolute';
        selectEl.style.inset = '0';
        selectEl.style.opacity = '0';
        selectEl.style.cursor = 'pointer';

        this.style.width = '100%';
        this.style.maxWidth = '400px';
        this.style.position = 'relative';

        this.options.forEach(option => {
            const text = option;
            const name = text.replaceAll(' ', '-').replaceAll('&', 'and').toLowerCase();

            const optionEl = document.createElement('option');
            optionEl.value = text;
            optionEl.innerText = text;

            selectEl.appendChild(optionEl);
        });

        this.appendChild(selectEl);
        this.appendChild(cosmeticEl);

        function onStateChange(e: any) {
            const value = e.target.value;
            if (value.length === 0) return;

            cosmeticEl.innerText =
                (
                    {
                        NC: 'North Carolina',
                        SC: 'South Carolina',
                        VA: 'Virginia',
                        WV: 'West Virginia',
                        GA: 'Georgia',
                        TN: 'Tennessee',
                    } as any
                )[value] || value;
            cosmeticEl.style.color = '#000';
        }

        selectEl.addEventListener('input', onStateChange);
        selectEl.addEventListener('blur', onStateChange);

        if (this.required) {
            const requiredLabel = document.createElement('span');
            requiredLabel.innerText = '* Required';
            requiredLabel.style.color = 'red';
            requiredLabel.style.fontSize = '1.2rem';

            this.appendChild(requiredLabel);
        }
    }
}
