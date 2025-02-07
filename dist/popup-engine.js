// src/recaptcha.ts
function getRecaptchaToken() {
  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      grecaptcha.execute("6LcGARMqAAAAALjAhYoFdENy3p5ArHtMkJrS4lLt", {
        action: "submit"
      }).then((token) => {
        resolve(token);
      }).catch((err) => {
        reject(err);
      });
    });
  });
}

// src/api.ts
async function submitDesignForm(data) {
  const token = await getRecaptchaToken();
  if (!token)
    throw new Error("Could not get recaptcha token");
  const response = await fetch("https://api.settlemyrenursery.com/design", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  const text = await response.text();
  if (!response.ok)
    throw new Error(text);
  return text;
}

// src/models/components/fancy-select.ts
class FancySelect extends HTMLElement {
  key;
  options;
  constructor() {
    super();
    this.key = null;
    this.options = null;
    try {
      this.setup();
    } catch (e) {
      console.error(e);
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
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
    const getAttr = (attr) => {
      const attrV = this.getAttribute(attr);
      if (!attrV)
        throw new Error(`${attr} attribute is required`);
      return attrV;
    };
    this.key = getAttr("key");
    this.options = getAttr("options").split(",");
    if (!this.key || !this.options)
      throw new Error("missing required attributes");
    this.style.display = "flex";
    this.style.flexFlow = "wrap";
    this.style.gap = "1rem";
    this.style.justifyContent = "center";
    this.innerHTML = "";
    this.options.forEach((option) => {
      let text = option;
      if (!text)
        return console.error("option text is required");
      let name = text.replaceAll(" ", "-").replaceAll("&", "and").toLowerCase();
      let elCheckbox = document.createElement("input");
      elCheckbox.type = "checkbox";
      if (!this.key)
        throw new Error("key attribute is required");
      elCheckbox.name = this.key;
      elCheckbox.id = name;
      elCheckbox.className = "fancy-checkbox";
      elCheckbox.setAttribute("value", text);
      elCheckbox.style.display = "none";
      let elLabel = document.createElement("label");
      elLabel.textContent = text;
      elLabel.setAttribute("for", name);
      elLabel.style.display = "grid";
      elLabel.style.placeItems = "center";
      elLabel.style.whiteSpace = "nowrap";
      elLabel.style.padding = "0.8rem 1.2rem";
      elLabel.style.border = "solid 1px rgba(0, 0, 0, 0.3)";
      elLabel.style.borderRadius = "999px";
      elLabel.style.userSelect = "none";
      elLabel.style.cursor = "pointer";
      elLabel.style.fontSize = "1.2rem";
      let s = document.createElement("style");
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
      let wrapper = document.createElement("div");
      wrapper.appendChild(s);
      wrapper.appendChild(elCheckbox);
      wrapper.appendChild(elLabel);
      this.appendChild(wrapper);
    });
  }
}

// src/models/components/fancy-input.ts
class FancyInput extends HTMLElement {
  key;
  type;
  label;
  required;
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
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
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
    const getAttr = (attr) => {
      const attrV = this.getAttribute(attr);
      if (!attrV)
        throw new Error(`${attr} attribute is required`);
      return attrV;
    };
    this.key = getAttr("key");
    this.type = getAttr("type");
    this.label = getAttr("label");
    this.required = this.hasAttribute("required");
    if (!this.key || !this.type || !this.label)
      throw new Error("missing required attributes");
    this.innerHTML = "";
    const inputEl = document.createElement("input");
    inputEl.type = this.type;
    inputEl.required = this.required;
    inputEl.id = this.key;
    inputEl.name = this.key;
    inputEl.placeholder = "";
    inputEl.classList.add("fancy-input", "empty");
    const placeholderEl = document.createElement("span");
    placeholderEl.innerText = this.label;
    placeholderEl.classList.add("fancy-input-placeholder");
    const styleEl = document.createElement("style");
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
    const wrapperEl = document.createElement("div");
    wrapperEl.style.position = "relative";
    wrapperEl.appendChild(inputEl);
    wrapperEl.appendChild(placeholderEl);
    this.appendChild(styleEl);
    this.appendChild(wrapperEl);
    if (this.required) {
      const requiredLabel = document.createElement("span");
      requiredLabel.innerText = "* Required";
      requiredLabel.style.color = "red";
      requiredLabel.style.fontSize = "1.2rem";
      this.appendChild(requiredLabel);
    }
    inputEl.addEventListener("input", () => {
      if (inputEl.value.length === 0) {
        inputEl.classList.add("empty");
      } else {
        inputEl.classList.remove("empty");
      }
    });
  }
}

// src/models/components/fancy-radio.ts
class FancyRadio extends HTMLElement {
  key;
  options;
  constructor() {
    super();
    this.key = null;
    this.options = null;
    try {
      this.setup();
    } catch (e) {
      console.error(e);
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
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
    const getAttr = (attr) => {
      const attrV = this.getAttribute(attr);
      if (!attrV)
        throw new Error(`${attr} attribute is required`);
      return attrV;
    };
    this.key = getAttr("key");
    this.options = getAttr("options").split(",");
    if (!this.key || !this.options)
      throw new Error("missing required attributes");
    this.innerHTML = "";
    this.options.forEach((option) => {
      let text = option;
      if (!text)
        return console.error("option text is required");
      let name = text.replaceAll(" ", "-").replaceAll("&", "and").toLowerCase();
      let radioEl = document.createElement("input");
      radioEl.type = "radio";
      if (!this.key)
        throw new Error("key is required");
      radioEl.name = this.key;
      radioEl.id = name;
      radioEl.className = "fancy-radio";
      radioEl.setAttribute("value", text);
      radioEl.style.display = "none";
      let labelEl = document.createElement("label");
      labelEl.textContent = text;
      labelEl.setAttribute("for", name);
      labelEl.style.display = "grid";
      labelEl.style.placeItems = "center";
      labelEl.style.whiteSpace = "nowrap";
      labelEl.style.padding = "0.8rem 1.2rem";
      labelEl.style.border = "solid 1px rgba(0, 0, 0, 0.3)";
      labelEl.style.borderRadius = "999px";
      labelEl.style.userSelect = "none";
      labelEl.style.cursor = "pointer";
      labelEl.style.fontSize = "1.2rem";
      const transitionTime = 150;
      const clickTime = 100;
      const clickHold = 100;
      const transitionDelay = clickTime + clickHold;
      let s = document.createElement("style");
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
      radioEl.addEventListener("input", () => {
        labelEl.classList.add("clicked");
        setTimeout(() => {
          labelEl.classList.remove("clicked");
        }, transitionDelay);
      });
      let wrapper = document.createElement("div");
      wrapper.appendChild(s);
      wrapper.appendChild(radioEl);
      wrapper.appendChild(labelEl);
      this.appendChild(wrapper);
      this.style.display = "flex";
      this.style.flexDirection = "row";
      this.style.gap = "1rem";
      this.style.flexWrap = "wrap";
      this.style.justifyContent = "center";
    });
  }
}

// src/models/components/fancy-dropdown.ts
class FancyDropdown extends HTMLElement {
  key;
  options;
  placeholder;
  required;
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
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
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
    const getAttr = (attr) => {
      const attrV = this.getAttribute(attr);
      if (!attrV)
        throw new Error(`${attr} attribute is required`);
      return attrV;
    };
    this.key = getAttr("key");
    this.options = getAttr("options").split(",");
    this.placeholder = getAttr("placeholder");
    this.required = this.hasAttribute("required");
    if (!this.key || !this.options || !this.placeholder)
      throw new Error("missing required attributes");
    this.innerHTML = "";
    const selectEl = document.createElement("select");
    const cosmeticEl = document.createElement("div");
    selectEl.classList.add("fancy-dropdown");
    cosmeticEl.classList.add("fancy-dropdown-cosmetic");
    selectEl.name = this.key;
    selectEl.id = this.key;
    cosmeticEl.innerText = this.placeholder;
    cosmeticEl.style.gap = "1rem";
    cosmeticEl.style.padding = "0.8rem 1.2rem";
    cosmeticEl.style.paddingLeft = "0";
    cosmeticEl.style.border = "none";
    cosmeticEl.style.borderBottom = "solid 2px rgba(0, 0, 0, 0.3)";
    cosmeticEl.style.position = "relative";
    cosmeticEl.style.fontSize = "1.4rem";
    cosmeticEl.style.userSelect = "none";
    cosmeticEl.style.pointerEvents = "none";
    cosmeticEl.style.width = "100%";
    selectEl.style.position = "absolute";
    selectEl.style.inset = "0";
    selectEl.style.opacity = "0";
    selectEl.style.cursor = "pointer";
    this.style.width = "100%";
    this.style.maxWidth = "400px";
    this.style.position = "relative";
    this.options.forEach((option) => {
      const text = option;
      const name = text.replaceAll(" ", "-").replaceAll("&", "and").toLowerCase();
      const optionEl = document.createElement("option");
      optionEl.value = text;
      optionEl.innerText = text;
      selectEl.appendChild(optionEl);
    });
    this.appendChild(selectEl);
    this.appendChild(cosmeticEl);
    function onStateChange(e) {
      const value = e.target.value;
      if (value.length === 0)
        return;
      cosmeticEl.innerText = {
        NC: "North Carolina",
        SC: "South Carolina",
        VA: "Virginia",
        WV: "West Virginia",
        GA: "Georgia",
        TN: "Tennessee"
      }[value] || value;
      cosmeticEl.style.color = "#000";
    }
    selectEl.addEventListener("input", onStateChange);
    selectEl.addEventListener("blur", onStateChange);
    if (this.required) {
      const requiredLabel = document.createElement("span");
      requiredLabel.innerText = "* Required";
      requiredLabel.style.color = "red";
      requiredLabel.style.fontSize = "1.2rem";
      this.appendChild(requiredLabel);
    }
  }
}

// src/models/components/fancy-textarea.ts
class FancyTextarea extends HTMLElement {
  key;
  placeholder;
  constructor() {
    super();
    this.key = null;
    this.placeholder = null;
    try {
      this.setup();
    } catch (e) {
      console.error(e);
    }
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
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
    const getAttr = (attr) => {
      const attrV = this.getAttribute(attr);
      if (!attrV)
        throw new Error(`${attr} attribute is required`);
      return attrV;
    };
    this.key = getAttr("key");
    this.placeholder = getAttr("placeholder");
    if (!this.key || !this.placeholder)
      throw new Error("missing required attributes");
    this.innerHTML = "";
    const textareaEl = document.createElement("textarea");
    textareaEl.classList.add("fancy-textarea");
    textareaEl.name = this.key;
    textareaEl.id = this.key;
    textareaEl.placeholder = this.placeholder;
    textareaEl.style.padding = "0.8rem 1.2rem";
    textareaEl.style.border = "2px solid rgba(0, 0, 0, 0.3)";
    textareaEl.style.borderRadius = "0.5rem";
    textareaEl.style.position = "relative";
    textareaEl.style.fontSize = "1.2rem";
    textareaEl.style.width = "100%";
    textareaEl.style.height = "100%";
    this.style.width = "100%";
    this.style.height = "100px";
    this.style.maxWidth = "400px";
    this.style.marginTop = "2rem";
    this.style.position = "relative";
    this.appendChild(textareaEl);
  }
}

// src/models/components/index.ts
function setup() {
  customElements.define("fancy-select", FancySelect);
  customElements.define("fancy-input", FancyInput);
  customElements.define("fancy-radio", FancyRadio);
  customElements.define("fancy-dropdown", FancyDropdown);
  customElements.define("fancy-textarea", FancyTextarea);
}

// src/models/overlay.ts
class Overlay {
  static zIndex = 99999999999;
  opacity;
  blur;
  uid;
  el;
  style;
  styleEl;
  parent;
  constructor(opacity = 0.4, blur = 2) {
    this.opacity = opacity;
    this.blur = blur;
    this.uid = "U" + (Date.now() + Math.random()).toString(16).replaceAll(".", "");
    this.el = document.createElement("div");
    this.el.classList.add("POPUP-OVERLAY", this.uid);
    this.style = `
            .${this.uid} {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                opacity: 0;
                height: 100vh;
                display: block !important;
                background-color: rgba(0, 0, 0, ${this.opacity});
                backdrop-filter: blur(${this.blur}px);
                z-index: ${Overlay.zIndex};
                transition: opacity 0.3s ease-in-out;
            }

            .${this.uid}.visible {
                opacity: 1;
            }
        `;
    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = this.style;
    setTimeout(() => {
      this.el.classList.add("visible");
    }, 5);
  }
  setupEventListeners() {
  }
  appendTo(el) {
    el.appendChild(this.styleEl);
    el.appendChild(this.el);
    this.setupEventListeners();
  }
  remove() {
    this.el.remove();
    this.styleEl.remove();
  }
}

class CloseableOverlay extends Overlay {
  constructor(opacity = 0.4, blur = 2) {
    super(opacity, blur);
  }
  setupEventListeners() {
    this.el.addEventListener("click", () => {
      if (this.parent)
        this.parent.remove();
      else
        this.remove();
    });
  }
}

// src/models/popup.ts
class Popup {
  static zIndex = 99999999999999;
  content;
  uid;
  el;
  style;
  styleEl;
  overlay;
  contentEl;
  buttonsWrapper;
  constructor(content, overlay = new CloseableOverlay, buttons, padding = "1rem") {
    if (typeof content === "string")
      this.content = content;
    else if (content instanceof HTMLElement)
      this.content = content;
    else if (content instanceof Array) {
      this.content = document.createElement("div");
      this.content.append(...content);
    } else {
      throw new Error("Invalid content type");
    }
    this.uid = "U" + (Date.now() + Math.random()).toString(16).replaceAll(".", "");
    this.el = document.createElement("div");
    this.el.classList.add("POPUP", this.uid);
    setTimeout(() => {
      this.el.classList.add("visible");
    }, 5);
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";
    this.el.style.gap = "1rem";
    this.contentEl = document.createElement("div");
    this.contentEl.classList.add("POPUP-CONTENT");
    this.contentEl.append(this.content);
    this.el.append(this.contentEl);
    if (buttons && buttons.length > 0) {
      this.buttonsWrapper = document.createElement("div");
      this.buttonsWrapper.classList.add("POPUP-BUTTONS");
      this.el.append(this.buttonsWrapper);
      buttons.forEach((button) => {
        const buttonEl = document.createElement("button");
        buttonEl.innerText = button.text;
        const variant = button.variant || "primary";
        buttonEl.classList.add("POPUP-BUTTON", variant);
        if (!this.buttonsWrapper)
          throw new Error("Buttons wrapper not found");
        this.buttonsWrapper.append(buttonEl);
        buttonEl.addEventListener("click", button.onClick);
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
    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = this.style;
    this.overlay = overlay;
    this.overlay.parent = this;
  }
  setupEventListeners() {
  }
  appendTo(el) {
    this.overlay.appendTo(el);
    el.appendChild(this.styleEl);
    el.appendChild(this.el);
    this.setupEventListeners();
  }
  append(el) {
    this.contentEl.append(el);
  }
  remove() {
    this.el.remove();
    this.styleEl.remove();
    this.overlay.remove();
  }
}

class FormPopup extends Popup {
  formEl;
  eventCallbacks;
  constructor(content, overlay = new CloseableOverlay, buttons) {
    super("", overlay, buttons);
    this.formEl = document.createElement("form");
    this.formEl.classList.add("POPUP-FORM");
    this.append(this.formEl);
    this.eventCallbacks = new Map;
    content.forEach((item) => {
      if (typeof item === "string") {
        if (item === "br")
          new Array(1).fill(0).map(() => document.createElement("br")).forEach((v) => this.formEl.append(v));
      } else {
        if (item.input) {
          const el = document.createElement("fancy-input");
          el.setAttribute("key", item.input.key);
          el.setAttribute("type", item.input.type);
          el.setAttribute("label", item.input.label);
          if (item.input.required)
            el.setAttribute("required", "");
          this.formEl.append(el);
        }
        if (item.select) {
          const el = document.createElement("fancy-select");
          el.setAttribute("key", item.select.key);
          el.setAttribute("options", item.select.options.join(","));
          this.formEl.append(el);
        }
        if (item.radio) {
          const el = document.createElement("fancy-radio");
          el.setAttribute("key", item.radio.key);
          el.setAttribute("options", item.radio.options.join(","));
          this.formEl.append(el);
        }
        if (item.dropdown) {
          const el = document.createElement("fancy-dropdown");
          el.setAttribute("key", item.dropdown.key);
          el.setAttribute("options", item.dropdown.options.join(","));
          el.setAttribute("placeholder", item.dropdown.placeholder);
          if (item.dropdown.required)
            el.setAttribute("required", "");
          this.formEl.append(el);
        }
        if (item.textarea) {
          const el = document.createElement("fancy-textarea");
          el.setAttribute("key", item.textarea.key);
          el.setAttribute("placeholder", item.textarea.placeholder);
          this.formEl.append(el);
        }
        if (item.title) {
          const h2 = document.createElement("h2");
          h2.innerText = item.title;
          h2.style.marginTop = "0";
          h2.style.fontSize = "2.7rem";
          h2.style.textAlign = "center";
          h2.style.maxWidth = "400px";
          this.formEl.append(h2);
        }
        if (item.img) {
          const img = document.createElement("img");
          img.src = item.img;
          img.style.width = "30%";
          img.style.height = "auto";
          this.formEl.append(img);
        }
        if (item.header) {
          const h3 = document.createElement("h3");
          h3.innerText = item.header;
          h3.style.margin = "0";
          h3.style.textAlign = "center";
          h3.style.fontSize = "2.2rem";
          h3.style.maxWidth = "400px";
          if (!item.subheader)
            h3.style.marginBottom = "1rem";
          this.formEl.append(h3);
        }
        if (item.subheader) {
          const h4 = document.createElement("h4");
          h4.innerText = item.subheader;
          h4.style.margin = "0";
          h4.style.marginBottom = "1rem";
          h4.style.textAlign = "center";
          h4.style.maxWidth = "400px";
          this.formEl.append(h4);
        }
      }
    });
    const submitBtn = document.createElement("button");
    submitBtn.innerText = "submit";
    submitBtn.style.display = "none";
    this.formEl.appendChild(submitBtn);
  }
  on(event, callback) {
    this.eventCallbacks.set(event, callback);
  }
  setupEventListeners() {
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(this.formEl);
      const formMap = new Map;
      formData.forEach((value, key) => {
        if (typeof value !== "string")
          return;
        if (formMap.has(key)) {
          const v = formMap.get(key);
          if (v instanceof Array) {
            formMap.set(key, [...v, value]);
          } else if (typeof v === "string") {
            formMap.set(key, [v, value]);
          } else {
            return;
          }
        } else {
          formMap.set(key, value);
        }
      });
      const cb = this.eventCallbacks.get("submit");
      if (!cb)
        return console.log(formMap);
      cb(formMap);
    });
  }
}

// src/index.ts
setup();
function createPopup_(title, content) {
  let d = document.createElement("div");
  let h1 = document.createElement("h1");
  h1.innerText = title;
  d.appendChild(h1);
  d.append(content);
  d.style.minWidth = "300px";
  const popup = new Popup(d, new CloseableOverlay, [
    { text: "Close", variant: "outline", onClick: () => popup.remove() }
  ]);
  popup.appendTo(document.body);
  return popup;
}
function createLandscapePopup(closeable = true) {
  const overlay = closeable ? new CloseableOverlay : new Overlay;
  const popup = new FormPopup([
    {
      img: "https://cdn.shopify.com/s/files/1/0655/9193/5143/files/Logo.jpg?v=1721997006"
    },
    {
      title: "Landscape Design"
    },
    {
      header: "I'm interested in:",
      subheader: "(Choose all that apply)"
    },
    {
      select: {
        key: "interested_in",
        options: [
          "Free Sketch-N-Go Service",
          "Scaled Drawing",
          "Digital Rendering",
          "On-Site Consultation",
          "Delivery & Placement Service",
          "Professional Installation",
          "Retaining Wall",
          "Patio",
          "Fire Pit",
          "Water Features"
        ]
      }
    },
    "br",
    "br",
    {
      header: "I wanted to get started:"
    },
    {
      radio: {
        key: "getStarted",
        options: ["Right Now!", "This Weekend", "2-4 Weeks", "4 Weeks or Longer"]
      }
    },
    "br",
    "br",
    {
      header: "Enter your contact information:"
    },
    {
      input: {
        key: "firstName",
        type: "text",
        label: "First Name",
        required: true
      }
    },
    {
      input: {
        key: "lastName",
        type: "text",
        label: "Last Name",
        required: true
      }
    },
    {
      input: {
        key: "email",
        type: "email",
        label: "Email",
        required: true
      }
    },
    {
      input: {
        key: "phone",
        type: "tel",
        label: "Phone Number",
        required: true
      }
    },
    {
      input: {
        key: "address",
        type: "text",
        label: "Street Address",
        required: true
      }
    },
    {
      input: {
        key: "city",
        type: "text",
        label: "City",
        required: true
      }
    },
    {
      dropdown: {
        key: "state",
        options: ["", "NC", "SC", "VA", "WV", "GA", "TN"],
        placeholder: "State",
        required: true
      }
    },
    {
      input: {
        key: "zip",
        type: "text",
        label: "Zip Code",
        required: true
      }
    },
    "br",
    "br",
    {
      header: "Please include ANY additional information you would like us to know about your landscape project."
    },
    {
      textarea: {
        key: "comments",
        placeholder: "Comments"
      }
    }
  ], overlay, [
    { text: "Cancel", variant: "outline", onClick: () => popup.remove() },
    { text: "Submit", onClick: () => popup.formEl.querySelector("button")?.click() }
  ]);
  popup.on("submit", async (formData) => {
    const data = {
      city: formData.get("city"),
      state: formData.get("state"),
      zip_code: formData.get("zip"),
      interested_in: formData.get("interested_in"),
      timeline: formData.get("getStarted"),
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      street: formData.get("address"),
      comments: formData.get("comments")
    };
    try {
      const response = await submitDesignForm(data);
      popup.remove();
      createPopup_("Thank you!", response);
    } catch (e) {
      popup.remove();
      console.error(e);
      createPopup_("Oops!", "An error occurred. Please try again.");
    }
  });
  popup.appendTo(document.body);
  popup.formEl.classList.add("landscape-form");
  return popup;
}
