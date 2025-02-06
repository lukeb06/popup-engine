import { FancySelect } from './fancy-select';
import { FancyInput } from './fancy-input';
import { FancyRadio } from './fancy-radio';
import { FancyDropdown } from './fancy-dropdown';
import { FancyTextarea } from './fancy-textarea';

export function setup() {
    customElements.define('fancy-select', FancySelect);
    customElements.define('fancy-input', FancyInput);
    customElements.define('fancy-radio', FancyRadio);
    customElements.define('fancy-dropdown', FancyDropdown);
    customElements.define('fancy-textarea', FancyTextarea);
}
