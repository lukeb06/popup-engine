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
                height: 100vh;
                display: block !important;
                background-color: rgba(0, 0, 0, ${this.opacity});
                backdrop-filter: blur(${this.blur}px);
                z-index: ${Overlay.zIndex};
            }
        `;
    this.styleEl = document.createElement("style");
    this.styleEl.innerHTML = this.style;
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
  constructor(content, overlay = new CloseableOverlay, buttons) {
    this.content = content;
    this.uid = "U" + (Date.now() + Math.random()).toString(16).replaceAll(".", "");
    this.el = document.createElement("div");
    this.el.classList.add("POPUP", this.uid);
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
        buttonEl.classList.add("POPUP-BUTTON");
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
  remove() {
    this.el.remove();
    this.styleEl.remove();
    this.overlay.remove();
  }
}

// src/index.ts
function createPopup(content, closeable = true, buttons) {
  const overlay = closeable ? new CloseableOverlay : new Overlay;
  const popup = new Popup(content, overlay, buttons);
  popup.appendTo(document.body);
  return popup;
}
