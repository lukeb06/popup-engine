export class FancyTextarea extends HTMLElement {
    key: string | null;
    placeholder: string | null;

    constructor() {
        super();

        this.key = null;
        this.placeholder = null;

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
        this.placeholder = getAttr('placeholder');

        if (!this.key || !this.placeholder) throw new Error('missing required attributes');

        this.innerHTML = '';

        const textareaEl = document.createElement('textarea');
        textareaEl.classList.add('fancy-textarea');
        textareaEl.name = this.key;
        textareaEl.id = this.key;
        textareaEl.placeholder = this.placeholder;

        textareaEl.style.padding = '0.8rem 1.2rem';
        textareaEl.style.border = '2px solid rgba(0, 0, 0, 0.3)';
        textareaEl.style.borderRadius = '0.5rem';
        textareaEl.style.position = 'relative';
        textareaEl.style.fontSize = '1.2rem';
        textareaEl.style.width = '100%';
        textareaEl.style.height = '100%';

        this.style.width = '100%';
        this.style.height = '100px';
        this.style.maxWidth = '400px';
        this.style.marginTop = '2rem';
        this.style.position = 'relative';

        this.appendChild(textareaEl);
    }
}
