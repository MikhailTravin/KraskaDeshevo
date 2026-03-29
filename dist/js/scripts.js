const modules_flsModules = {};

let bodyLockStatus = true;
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    setTimeout((() => {
      lockPaddingElements.forEach((lockPaddingElement => {
        lockPaddingElement.style.paddingRight = "";
      }));
      document.body.style.paddingRight = "";
      document.documentElement.classList.remove("lock");
    }), delay);
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    }));
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.classList.add("lock");
    bodyLockStatus = false;
    setTimeout((function () {
      bodyLockStatus = true;
    }), delay);
  }
};
function functions_FLS(message) {
  setTimeout((() => {
    if (window.FLS) console.log(message);
  }), 0);
}

let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout((() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("_slide")) {
    target.classList.add("_slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout((() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("_slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }), duration);
  }
};
let _slideToggle = (target, duration = 500) => {
  if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
};

function getHash() {
  if (location.hash) { return location.hash.replace('#', ''); }
}

function dataMediaQueries(array, dataSetValue) {
  const media = Array.from(array).filter(function (item) {
    return item.dataset[dataSetValue];
  });

  if (media.length) {
    const breakpointsArray = media.map(item => {
      const params = item.dataset[dataSetValue];
      const paramsArray = params.split(",");
      return {
        value: paramsArray[0],
        type: paramsArray[1] ? paramsArray[1].trim() : "max",
        item: item
      };
    });

    const mdQueries = uniqArray(
      breakpointsArray.map(item => `(${item.type}-width: ${item.value}px),${item.value},${item.type}`)
    );

    const mdQueriesArray = mdQueries.map(breakpoint => {
      const [query, value, type] = breakpoint.split(",");
      const matchMedia = window.matchMedia(query);
      const itemsArray = breakpointsArray.filter(item => item.value === value && item.type === type);
      return { itemsArray, matchMedia };
    });

    return mdQueriesArray;
  }
}

function uniqArray(array) {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
}

//========================================================================================================================================================

const iconMenu = document.querySelector('.header__icon');
const headerBody = document.querySelector('.header__menu');

if (iconMenu) {
  iconMenu.addEventListener("click", function (e) {
    e.stopPropagation();

    document.documentElement.classList.toggle("menu-open");
  });

  document.addEventListener('click', function (e) {
    const isClickInsideHeaderBody = headerBody && headerBody.contains(e.target);
    const isClickOnMenuIcon = e.target === iconMenu || iconMenu.contains(e.target);

    if (!isClickInsideHeaderBody && !isClickOnMenuIcon) {
      document.documentElement.classList.remove("menu-open");
    }
  });
}

//========================================================================================================================================================

// Добавление к шапке при скролле
const header = document.querySelector('.header');
if (header) {
  window.addEventListener('scroll', function () {
    if (window.scrollY > 0) {
      header.classList.add('_header-scroll');
      document.documentElement.classList.add('header-scroll');
    } else {
      header.classList.remove('_header-scroll');
      document.documentElement.classList.remove('header-scroll');
    }
  });
}

//========================================================================================================================================================

//Попап
class Popup {
  constructor(options) {
    let config = {
      logging: true,
      init: true,
      attributeOpenButton: "data-popup",
      attributeCloseButton: "data-close",
      fixElementSelector: "[data-lp]",
      youtubeAttribute: "data-popup-youtube",
      youtubePlaceAttribute: "data-popup-youtube-place",
      setAutoplayYoutube: true,
      classes: {
        popup: "popup",
        popupContent: "popup__content",
        popupActive: "popup_show",
        bodyActive: "popup-show"
      },
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hashSettings: {
        goHash: true
      },
      on: {
        beforeOpen: function () { },
        afterOpen: function () { },
        beforeClose: function () { },
        afterClose: function () { }
      }
    };
    this.youTubeCode;
    this.isOpen = false;
    this.targetOpen = {
      selector: false,
      element: false
    };
    this.previousOpen = {
      selector: false,
      element: false
    };
    this.lastClosed = {
      selector: false,
      element: false
    };
    this._dataValue = false;
    this.hash = false;
    this._reopen = false;
    this._selectorOpen = false;
    this.lastFocusEl = false;
    this._focusEl = ["a[href]", 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', "button:not([disabled]):not([aria-hidden])", "select:not([disabled]):not([aria-hidden])", "textarea:not([disabled]):not([aria-hidden])", "area[href]", "iframe", "object", "embed", "[contenteditable]", '[tabindex]:not([tabindex^="-"])'];
    this.options = {
      ...config,
      ...options,
      classes: {
        ...config.classes,
        ...options?.classes
      },
      hashSettings: {
        ...config.hashSettings,
        ...options?.hashSettings
      },
      on: {
        ...config.on,
        ...options?.on
      }
    };
    this.bodyLock = false;
    this.previousMenuState = false;
    this.options.init ? this.initPopups() : null;
  }
  initPopups() {
    this.eventsPopup();
  }
  eventsPopup() {
    document.addEventListener("click", function (e) {
      const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
      if (buttonOpen) {
        e.preventDefault();
        this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
        this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
        if ("error" !== this._dataValue) {
          if (!this.isOpen) this.lastFocusEl = buttonOpen;
          this.targetOpen.selector = `${this._dataValue}`;
          this._selectorOpen = true;
          this.open();
          return;
        }
        return;
      }
      const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
      if (buttonClose || !e.target.closest(`.${this.options.classes.popupContent}`) && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
    }.bind(this));
    document.addEventListener("keydown", function (e) {
      if (this.options.closeEsc && 27 == e.which && "Escape" === e.code && this.isOpen) {
        e.preventDefault();
        this.close();
        return;
      }
      if (this.options.focusCatch && 9 == e.which && this.isOpen) {
        this._focusCatch(e);
        return;
      }
    }.bind(this));
    if (this.options.hashSettings.goHash) {
      window.addEventListener("hashchange", function () {
        if (window.location.hash) this._openToHash(); else this.close(this.targetOpen.selector);
      }.bind(this));
      window.addEventListener("load", function () {
        if (window.location.hash) this._openToHash();
      }.bind(this));
    }
  }
  open(selectorValue) {
    if (bodyLockStatus) {
      this.bodyLock = document.documentElement.classList.contains("lock") && !this.isOpen ? true : false;
      if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) {
        this.targetOpen.selector = selectorValue;
        this._selectorOpen = true;
      }
      if (this.isOpen) {
        this._reopen = true;
        this.close();
      }
      if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
      if (!this._reopen) this.previousActiveElement = document.activeElement;
      this.targetOpen.element = document.querySelector(this.targetOpen.selector);
      if (this.targetOpen.element) {
        this.previousMenuState = document.documentElement.classList.contains('menu-open');
        if (this.previousMenuState) {
          if (typeof menuClose === 'function') {
            menuClose();
          } else {
            document.documentElement.classList.remove("menu-open");
            if (typeof bodyUnlock === 'function') bodyUnlock();
          }
        }
        if (this.youTubeCode) {
          const codeVideo = this.youTubeCode;
          const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
          const iframe = document.createElement("iframe");
          iframe.setAttribute("allowfullscreen", "");
          const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
          iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
          iframe.setAttribute("src", urlVideo);
          if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
            this.targetOpen.element.querySelector(".popup__text").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
          }
          this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
        }
        const videoElement = this.targetOpen.element.querySelector("video");
        if (videoElement) {
          videoElement.muted = true;
          videoElement.currentTime = 0;
          videoElement.play().catch((e => console.error("Autoplay error:", e)));
        }
        if (this.options.hashSettings.location) {
          this._getHash();
          this._setHash();
        }
        this.options.on.beforeOpen(this);
        document.dispatchEvent(new CustomEvent("beforePopupOpen", {
          detail: {
            popup: this
          }
        }));
        this.targetOpen.element.classList.add(this.options.classes.popupActive);
        document.documentElement.classList.add(this.options.classes.bodyActive);
        if (!this._reopen) !this.bodyLock ? bodyLock() : null; else this._reopen = false;
        this.targetOpen.element.setAttribute("aria-hidden", "false");
        this.previousOpen.selector = this.targetOpen.selector;
        this.previousOpen.element = this.targetOpen.element;
        this._selectorOpen = false;
        this.isOpen = true;
        this.options.on.afterOpen(this);
        document.dispatchEvent(new CustomEvent("afterPopupOpen", {
          detail: {
            popup: this
          }
        }));
      }
    }
  }
  close(selectorValue) {
    if (selectorValue && "string" === typeof selectorValue && "" !== selectorValue.trim()) this.previousOpen.selector = selectorValue;
    if (!this.isOpen || !bodyLockStatus) return;
    this.options.on.beforeClose(this);
    document.dispatchEvent(new CustomEvent("beforePopupClose", {
      detail: {
        popup: this
      }
    }));
    if (this.youTubeCode) if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
    this.previousOpen.element.classList.remove(this.options.classes.popupActive);
    const videoElement = this.previousOpen.element.querySelector("video");
    if (videoElement) videoElement.pause();
    this.previousOpen.element.setAttribute("aria-hidden", "true");
    if (!this._reopen) {
      document.documentElement.classList.remove(this.options.classes.bodyActive);
      !this.bodyLock ? bodyUnlock() : null;
      this.isOpen = false;
      if (this.previousMenuState) {
        if (typeof menuOpen === 'function') {
          menuOpen();
        } else {
          document.documentElement.classList.add("menu-open");
          if (typeof bodyLock === 'function') bodyLock();
        }
      }
    }
    document.dispatchEvent(new CustomEvent("afterPopupClose", {
      detail: {
        popup: this
      }
    }));
    this.options.on.afterClose(this);
  }
  _getHash() {
    if (this.options.hashSettings.location) this.hash = this.targetOpen.selector.includes("#") ? this.targetOpen.selector : this.targetOpen.selector.replace(".", "#");
  }
  _openToHash() {
    let classInHash = document.querySelector(`.${window.location.hash.replace("#", "")}`) ? `.${window.location.hash.replace("#", "")}` : document.querySelector(`${window.location.hash}`) ? `${window.location.hash}` : null;
    const buttons = document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) ? document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash}"]`) : document.querySelector(`[${this.options.attributeOpenButton} = "${classInHash.replace(".", "#")}"]`);
    if (buttons && classInHash) this.open(classInHash);
  }
  _setHash() {
    history.pushState("", "", this.hash);
  }
  _removeHash() {
    history.pushState("", "", window.location.href.split("#")[0]);
  }
  _focusCatch(e) {
    const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
    const focusArray = Array.prototype.slice.call(focusable);
    const focusedIndex = focusArray.indexOf(document.activeElement);
    if (e.shiftKey && 0 === focusedIndex) {
      focusArray[focusArray.length - 1].focus();
      e.preventDefault();
    }
    if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
      focusArray[0].focus();
      e.preventDefault();
    }
  }
}
modules_flsModules.popup = new Popup({});

function menuOpen() {
  bodyLock();
  document.documentElement.classList.add("menu-open");
}
function menuClose() {
  bodyUnlock();
  document.documentElement.classList.remove("menu-open");
}

//========================================================================================================================================================

//Маска
const telephone = document.querySelectorAll('.telephone');
if (telephone) {
  Inputmask({
    "mask": "+7 (999) 999 - 99 - 99",
    "showMaskOnHover": false,
  }).mask(telephone);
}

//========================================================================================================================================================

//Табы
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener("click", setTabsAction);
      initTabs(tabsBlock);
    });

    let mdQueriesArray = dataMediaQueries(tabs, "tabs");
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        mdQueriesItem.matchMedia.addEventListener("change", function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }

  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems = Array.from(tabsContentItems).filter(item => item.closest('[data-tabs]') === tabsMediaItem);
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }

  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector('[data-tabs-titles]>._tab-active');
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_tab-active') : null;
    }
    if (tabsContent.length) {
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_tab-active');
        }
        tabsContentItem.hidden = !tabsTitles[index].classList.contains('_tab-active');
      });
    }
    setTabsStatus(tabsBlock);
    initGallerySliders(tabsBlock);
  }

  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;

    function isTabsAnimate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0 ? Number(tabsBlock.dataset.tabsAnimate) : 500;
      }
      return false;
    }
    const tabsBlockAnimate = isTabsAnimate(tabsBlock);

    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsTitles = Array.from(tabsTitles).filter(item => item.closest('[data-tabs]') === tabsBlock);
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_tab-active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.popup')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
          initGallerySliders(tabsBlock);
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }

  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (!tabTitle.classList.contains('_tab-active') && !tabsBlock.querySelector('._slide')) {
        let tabActiveTitle = tabsBlock.querySelectorAll('[data-tabs-title]._tab-active');
        tabActiveTitle = Array.from(tabActiveTitle).filter(item => item.closest('[data-tabs]') === tabsBlock);
        if (tabActiveTitle.length) tabActiveTitle[0].classList.remove('_tab-active');
        tabTitle.classList.add('_tab-active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }

  initGallerySliders();
}
tabs();

//========================================================================================================================================================

//Форма
function formFieldsInit(options = { viewPass: true, autoHeight: false }) {
  document.body.addEventListener("focusin", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      formValidate.removeError(targetElement);
      targetElement.hasAttribute('data-validate') ? formValidate.removeError(targetElement) : null;
    }
  });
  const originalFocusoutHandler = document.body._focusoutHandler;
  document.body.addEventListener("focusout", function (e) {
    const targetElement = e.target;
    if ((targetElement.tagName === 'INPUT' || targetElement.tagName === 'TEXTAREA')) {
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      if (targetElement.value.trim()) {
        targetElement.parentElement.classList.add('filled');
      } else {
        targetElement.parentElement.classList.remove('filled');
      }
      targetElement.hasAttribute('data-validate') ? formValidate.validateInput(targetElement) : null;

      const form = targetElement.closest('form');
      if (form) {
        const submitBtn = form.querySelector('.btn.disabled');
        if (submitBtn) {
          setTimeout(() => {
            const requiredFields = form.querySelectorAll('[data-required]');
            let allFilled = true;

            requiredFields.forEach(field => {
              if (field.type === 'checkbox') {
                if (!field.checked) allFilled = false;
              } else {
                if (!field.value.trim()) allFilled = false;
              }
            });

            if (allFilled) {
              submitBtn.classList.remove('disabled');
            } else {
              submitBtn.classList.add('disabled');
            }
          }, 50);
        }
      }
    }
  });
  if (options.viewPass) {
    document.addEventListener("click", function (e) {
      const targetElement = e.target;
      if (targetElement.closest('.form__viewpass')) {
        const viewpassBlock = targetElement.closest('.form__viewpass');
        const input = viewpassBlock.closest('.form__input').querySelector('input');

        if (input) {
          const isActive = viewpassBlock.classList.contains('_viewpass-active');
          input.setAttribute("type", isActive ? "password" : "text");
          viewpassBlock.classList.toggle('_viewpass-active');
        } else {
          console.error('Input не найден!');
        }
      }
    });
  }
  if (options.autoHeight) {
    const textareas = document.querySelectorAll('textarea[data-autoheight]');
    if (textareas.length) {
      textareas.forEach(textarea => {
        const startHeight = textarea.hasAttribute('data-autoheight-min') ?
          Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
        const maxHeight = textarea.hasAttribute('data-autoheight-max') ?
          Number(textarea.dataset.autoheightMax) : Infinity;
        setHeight(textarea, Math.min(startHeight, maxHeight))
        textarea.addEventListener('input', () => {
          if (textarea.scrollHeight > startHeight) {
            textarea.style.height = `auto`;
            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
          }
        });
      });
      function setHeight(textarea, height) {
        textarea.style.height = `${height}px`;
      }
    }
  }
}
formFieldsInit({
  viewPass: true,
  autoHeight: false
});

let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    let error = 0;

    if (formRequiredItem.dataset.required === "email") {
      formRequiredItem.value = formRequiredItem.value.replace(" ", "");
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
      this.addError(formRequiredItem);
      this.removeSuccess(formRequiredItem);
      error++;
    } else if (formRequiredItem.dataset.validate === "password-confirm") {
      const passwordInput = document.getElementById('password');
      if (!passwordInput) return error;

      if (formRequiredItem.value !== passwordInput.value) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    } else {
      if (!formRequiredItem.value.trim()) {
        this.addError(formRequiredItem);
        this.removeSuccess(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
        this.addSuccess(formRequiredItem);
      }
    }

    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    let inputError = formRequiredItem.parentElement.querySelector('.form__error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML('beforeend', `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
    }
    formRequiredItem.parentElement.classList.remove('filled');
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (formRequiredItem.parentElement.querySelector('.form__error')) {
      formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector('.form__error'));
    }
  },
  addSuccess(formRequiredItem) {
    formRequiredItem.classList.add('_form-success');
    formRequiredItem.parentElement.classList.add('_form-success');
    if (formRequiredItem.value.trim()) {
      formRequiredItem.parentElement.classList.add('filled');
    }
  },
  removeSuccess(formRequiredItem) {
    formRequiredItem.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('_form-success');
    formRequiredItem.parentElement.classList.remove('filled');
  },
  formClean(form) {
    form.reset();
    setTimeout(() => {
      let inputs = form.querySelectorAll('input,textarea');
      for (let index = 0; index < inputs.length; index++) {
        const el = inputs[index];
        el.parentElement.classList.remove('_form-focus');
        el.classList.remove('_form-focus');

        el.classList.remove('_form-success');
        el.parentElement.classList.remove('_form-success');

        el.parentElement.classList.remove('filled');

        formValidate.removeError(el);

        if (el.classList.contains('telephone') && el.clearFilled) {
          el.clearFilled();
        }
      }

      let checkboxes = form.querySelectorAll('.checkbox__input');
      if (checkboxes.length > 0) {
        for (let index = 0; index < checkboxes.length; index++) {
          const checkbox = checkboxes[index];
          checkbox.checked = false;
          checkbox.classList.remove('_form-success');
          checkbox.closest('.checkbox')?.classList.remove('_form-success');
        }
      }

      if (modules_flsModules.select) {
        let selects = form.querySelectorAll('div.select');
        if (selects.length) {
          for (let index = 0; index < selects.length; index++) {
            const select = selects[index].querySelector('select');
            modules_flsModules.select.selectBuild(select);
          }
        }
      }
    }, 0);
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
  }
};

function formSubmit() {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate') ? formValidate.getErrors(form) : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action') ? form.getAttribute('action').trim() : '#';
        const formMethod = form.getAttribute('method') ? form.getAttribute('method').trim() : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert("Помилка");
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      if (form.querySelector('._form-error') && form.hasAttribute('data-goto-error')) {
        const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : '._form-error';
        gotoBlock(formGoToErrorClass, true, 1000);
      }
    }
  }
  function formSent(form, responseResult = ``) {
    document.dispatchEvent(new CustomEvent("formSent", {
      detail: {
        form: form
      }
    }));

    const telephoneInputs = form.querySelectorAll('.telephone');
    telephoneInputs.forEach(input => {
      const parent = input.closest('.form__input');
      if (parent) {
        parent.classList.remove('filled');
      }
    });

    setTimeout(() => {
      if (modules_flsModules.popup) {
        const popup = form.dataset.popupMessage;
        popup ? modules_flsModules.popup.open(popup) : null;
      }
    }, 0);

    formValidate.formClean(form);
  }
}

formSubmit();

//========================================================================================================================================================

const filterBlocks = document.querySelectorAll('[data-filters]');

if (filterBlocks) {
  filterBlocks.forEach(block => {
    const filterButtons = block.querySelectorAll('.tabs-filter__title');
    const cardsContainer = block.querySelector('.block-catalog__cards');

    if (!cardsContainer) return;

    const productCards = cardsContainer.querySelectorAll('.product-card');

    function filterProducts(filterValue) {
      productCards.forEach(card => {
        const cardFilter = card.getAttribute('data-filter');

        if (filterValue === 'all' || cardFilter === filterValue) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    }

    filterButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();

        const filterValue = this.getAttribute('data-filter');

        filterButtons.forEach(btn => {
          btn.classList.remove('active');
        });

        this.classList.add('active');

        filterProducts(filterValue);
      });
    });

    if (productCards.length > 0) {
      filterProducts('all');
    }
  });
}

//========================================================================================================================================================

if (document.querySelector('.images-product')) {
  const thumbsSwiper = new Swiper('.images-product__thumb', {
    observer: true,
    observeParents: true,
    slidesPerView: 'auto',
    spaceBetween: 8,
    direction: "horizontal",
    speed: 400,
    navigation: {
      prevEl: '.images-product__arrow-prev',
      nextEl: '.images-product__arrow-next',
    },
    breakpoints: {
      768: {
        slidesPerView: 'auto',
        spaceBetween: 8,
        direction: "vertical",
      },
      992: {
        slidesPerView: 3,
        spaceBetween: 8,
      },
      1100: {
        slidesPerView: 4,
        spaceBetween: 8,
      },
      1300: {
        slidesPerView: 5,
        spaceBetween: 8,
      },
    },
  });

  const mainThumbsSwiper = new Swiper('.images-product__slider', {
    thumbs: {
      swiper: thumbsSwiper
    },
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 5,
    speed: 400,
    preloadImages: true,
    navigation: {
      prevEl: '.images-product__arrow-prev',
      nextEl: '.images-product__arrow-next',
    },
  });
}

if (document.querySelector('.block-reviews__slider')) {
  const swiperReviews = new Swiper('.block-reviews__slider', {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    spaceBetween: 16,
    speed: 400,
    navigation: {
      prevEl: '.block-reviews__arrow-prev',
      nextEl: '.block-reviews__arrow-next',
    },
    pagination: {
      el: ".block-reviews__pagination",
      clickable: true,
    },
    breakpoints: {
      650: {
        slidesPerView: 2,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1100: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
    },
  });
}

function initGallerySliders() {
  const tabBodies = document.querySelectorAll('[data-tabs-body] .tabs__body');

  tabBodies.forEach((tabBody) => {
    const sliderElement = tabBody.querySelector('.block-gallery__slider');

    if (sliderElement && !sliderElement.swiper) {
      const prevEl = tabBody.querySelector('.block-gallery__arrow-prev');
      const nextEl = tabBody.querySelector('.block-gallery__arrow-next');
      const paginationEl = tabBody.querySelector('.block-gallery__pagination');

      new Swiper(sliderElement, {
        observer: true,
        observeParents: true,
        slidesPerView: 1,
        spaceBetween: 16,
        speed: 400,
        navigation: {
          prevEl: prevEl,
          nextEl: nextEl,
        },
        pagination: {
          el: paginationEl,
          clickable: true,
        },
        breakpoints: {
          650: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 24,
          },
          1100: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
        },
      });
    }
  });
}
initGallerySliders();
window.addEventListener('resize', function () {
  initGallerySliders();
});

const slider = document.querySelector('.block-cooperation__slider');
let swiperCooperation = null;
const initSwiper = () => {
  if (window.innerWidth <= 768 && !swiperCooperation) {
    swiperCooperation = new Swiper('.block-cooperation__slider', {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      spaceBetween: 16,
      speed: 400,
      pagination: {
        el: ".block-cooperation__pagination",
        clickable: true,
      },
      breakpoints: {
        550: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
      },
    });
  } else if (window.innerWidth > 768 && swiperCooperation) {
    swiperCooperation.destroy(true, true);
    swiperCooperation = null;
  }
};
initSwiper();
window.addEventListener('resize', initSwiper);

//========================================================================================================================================================

//Звездный рейтинг
function formRating() {
  const ratings = document.querySelectorAll('[data-rating]');
  if (ratings) {
    ratings.forEach(rating => {
      const ratingValue = +rating.dataset.ratingValue;
      const ratingSize = +rating.dataset.ratingSize ? +rating.dataset.ratingSize : 5;
      formRatingInit(rating, ratingSize);
      ratingValue ? formRatingSet(rating, ratingValue) : null;
      document.addEventListener('click', formRatingAction);
    });
  }

  function formRatingAction(e) {
    const targetElement = e.target;
    if (targetElement.closest('.rating__input')) {
      const currentElement = targetElement.closest('.rating__input');
      const ratingValue = +currentElement.value;
      const rating = currentElement.closest('.rating');
      const ratingSet = rating.dataset.rating === 'set';
      ratingSet ? formRatingGet(rating, ratingValue) : null;
    }
  }

  function formRatingInit(rating, ratingSize) {
    let ratingItems = ``;
    for (let index = 0; index < ratingSize; index++) {
      index === 0 ? ratingItems += `<div class="rating__items">` : null;
      ratingItems += `
                <label class="rating__item">
                    <input class="rating__input" type="radio" name="rating" value="${index + 1}">
                </label>`;
      index === ratingSize ? ratingItems += `</div">` : null;
    }
    rating.insertAdjacentHTML("beforeend", ratingItems);
  }

  function formRatingGet(rating, ratingValue) {
    const resultRating = ratingValue;
    formRatingSet(rating, resultRating);
  }

  function formRatingSet(rating, value) {
    const ratingItems = rating.querySelectorAll('.rating__item');
    const resultFullItems = parseInt(value);
    const resultPartItem = value - resultFullItems;

    rating.hasAttribute('data-rating-title') ? rating.title = value : null;

    ratingItems.forEach((ratingItem, index) => {
      ratingItem.classList.remove('rating__item--active');
      ratingItem.querySelector('span') ? ratingItems[index].querySelector('span').remove() : null;

      if (index <= (resultFullItems - 1)) {
        ratingItem.classList.add('rating__item--active');
      }
      if (index === resultFullItems && resultPartItem) {
        ratingItem.insertAdjacentHTML("beforeend", `<span style="width:${resultPartItem * 100}%"></span>`);
      }
    });
  }

  function formRatingSend() {
  }
}
formRating();

//========================================================================================================================================================

//Количество
function formQuantity() {
  document.addEventListener("click", function (e) {
    let targetElement = e.target;
    if (targetElement.closest('[data-quantity-plus]') || targetElement.closest('[data-quantity-minus]')) {
      const quantityElement = targetElement.closest('[data-quantity]');
      const valueElement = quantityElement.querySelector('input[type="text"]');
      let value = parseInt(valueElement.value) || 0;

      if (targetElement.closest('[data-quantity-plus]')) {
        value++;
        if (quantityElement.dataset.quantityMax && +quantityElement.dataset.quantityMax < value) {
          value = quantityElement.dataset.quantityMax;
        }
      } else {
        value--;
        if (quantityElement.dataset.quantityMin) {
          if (+quantityElement.dataset.quantityMin > value) {
            value = quantityElement.dataset.quantityMin;
          }
        } else if (value < 1) {
          value = 1;
        }
      }
      valueElement.value = value;
    }
  });
}
formQuantity();

//========================================================================================================================================================

//Спойлер
function spollers() {
  const spollersArray = document.querySelectorAll("[data-spollers]");
  if (spollersArray.length > 0) {
    const spollersRegular = Array.from(spollersArray).filter((function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    }));
    if (spollersRegular.length) initSpollers(spollersRegular);

    spollersArray.forEach(spollersBlock => {
      const mediaQuery = spollersBlock.dataset.spollers;
      if (mediaQuery) {
        const [maxWidth, type] = mediaQuery.split(",");
        const width = parseInt(maxWidth);

        if (type === "max" && window.innerWidth <= width) {
          if (!spollersBlock.classList.contains("_spoller-init")) {
            initSpollers([spollersBlock]);
          }
        } else if (type === "max" && window.innerWidth > width) {
          if (spollersBlock.classList.contains("_spoller-init")) {
            spollersBlock.classList.remove("_spoller-init");
            initSpollerBody(spollersBlock, false);
            spollersBlock.removeEventListener("click", setSpollerAction);
          }
        }
      }
    });

    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach((spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add("_spoller-init");
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove("_spoller-init");
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener("click", setSpollerAction);
        }
      }));
    }

    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      let spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
      if (spollerTitles.length) {
        spollerTitles = Array.from(spollerTitles).filter((item => item.closest("[data-spollers]") === spollersBlock));
        spollerTitles.forEach((spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute("tabindex");
            if (!spollerTitle.classList.contains("_spoller-active")) {
              spollerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spollerTitle.setAttribute("tabindex", "-1");
            spollerTitle.nextElementSibling.hidden = false;
          }
        }));
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest("[data-spoller]")) {
        const spollerTitle = el.closest("[data-spoller]");

        const spollerItem = spollerTitle.closest(".spollers__item, .menu__item");
        const spollersBlock = spollerTitle.closest("[data-spollers]");

        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;

        if (!spollersBlock.querySelectorAll("._slide").length) {
          if (oneSpoller && !spollerTitle.classList.contains("_spoller-active")) {
            hideSpollersBody(spollersBlock);
          }

          spollerTitle.classList.toggle("_spoller-active");
          if (spollerItem) spollerItem.classList.toggle("_spoller-active");

          const contentBlock = spollerTitle.nextElementSibling;
          _slideToggle(contentBlock, spollerSpeed);

          e.preventDefault();
        }
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector("[data-spoller]._spoller-active");
      const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
      if (spollerActiveTitle && !spollersBlock.querySelectorAll("._slide").length) {
        const spollerItem = spollerActiveTitle.closest(".spollers__item, .menu__item");

        spollerActiveTitle.classList.remove("_spoller-active");
        if (spollerItem) spollerItem.classList.remove("_spoller-active");
        _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
      }
    }

    const spollersClose = document.querySelectorAll("[data-spoller-close]");
    if (spollersClose.length) {
      document.addEventListener("click", (function (e) {
        const el = e.target;
        if (!el.closest("[data-spollers]")) {
          spollersClose.forEach((spollerClose => {
            const spollersBlock = spollerClose.closest("[data-spollers]");
            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
            spollerClose.classList.remove("_spoller-active");

            const spollerItem = spollerClose.closest(".spollers__item, .menu__item");
            if (spollerItem) spollerItem.classList.remove("_spoller-active");

            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
          }));
        }
      }));
    }
  }
}
spollers();

//========================================================================================================================================================

const upButton = document.querySelector('.footer__up');

if (upButton) {
  upButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

//========================================================================================================================================================

const mapElement = document.querySelector('#map1');
if (mapElement) {
  const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        mapObserver.unobserve(mapElement);

        if (typeof ymaps === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU';
          script.async = true;

          script.onload = () => {
            if (typeof ymaps !== 'undefined') {
              ymaps.ready(safeInitMap);
            }
          };

          script.onerror = () => {
            console.error('Yandex Maps failed to load');
          };

          document.head.appendChild(script);
        } else {
          ymaps.ready(safeInitMap);  // ← Запускаем через ymaps.ready
        }
      }
    });
  }, {
    rootMargin: '0px 0px 200px 0px'
  });

  mapObserver.observe(mapElement);
}
function safeInitMap() {
  const mapElement = document.getElementById('map1');
  if (!mapElement || mapElement.dataset.initialized === 'true') return;

  const myMap = new ymaps.Map('map1', {
    center: [54.994595, 73.363168],
    zoom: 17,
    controls: ['zoomControl']
  });

  const placemark = new ymaps.Placemark([54.994595, 73.363168], {
  }, {
  });

  myMap.geoObjects.add(placemark);

  mapElement.dataset.initialized = 'true';
}

//========================================================================================================================================================


Fancybox.bind("[data-fancybox]", {
  // опции
});

//========================================================================================================================================================

const popupProductSelect = document.querySelector('.popup-product-select');

if (popupProductSelect) {
  const paletteContainer = document.querySelector('.popup-product-button__palette');
  const colorsContainer = document.querySelector('.popup-product-button__colors');
  const titleSpan = document.querySelector('.popup-product-button__titles span');
  const trashBtn = document.querySelector('.popup-product-button__trash');
  const paletteOptions = document.querySelectorAll('[data-palette] .options2__item');
  const checkboxesContainer = document.querySelector('[data-checked]');
  const dropdown = document.querySelector('.popup-product-select__dropdown');
  const productButton = document.querySelector('.popup-product-button');

  paletteContainer.style.display = 'none';
  colorsContainer.style.display = 'none';
  if (trashBtn) {
    trashBtn.style.display = 'none';
  }

  let selectedPalette = null;
  let selectedColors = [];
  let maxColors = 0;
  let isActive = false;

  function getMaxColors() {
    if (checkboxesContainer) {
      const max = parseInt(checkboxesContainer.getAttribute('data-checked'));
      return isNaN(max) ? 0 : max;
    }
    return 0;
  }

  maxColors = getMaxColors();

  function updateVisibility() {
    if (selectedPalette) {
      paletteContainer.style.display = 'flex';
    } else {
      paletteContainer.style.display = 'none';
    }

    if (selectedColors.length > 0) {
      colorsContainer.style.display = 'flex';
    } else {
      colorsContainer.style.display = 'none';
    }

    if (trashBtn) {
      if (selectedPalette || selectedColors.length > 0) {
        trashBtn.style.display = 'flex';
      } else {
        trashBtn.style.display = 'none';
      }
    }

    if (selectedPalette || selectedColors.length > 0) {
      titleSpan.style.display = 'none';
    } else {
      titleSpan.style.display = 'inline';
    }
  }

  function updateColorsDisplay() {
    colorsContainer.innerHTML = '';

    selectedColors.forEach((color, index) => {
      const colorElement = document.createElement('div');
      colorElement.className = 'popup-product-button__color';

      let displayText = color.text;
      if (index < selectedColors.length - 1) {
        displayText = color.text + ',';
      }

      colorElement.textContent = displayText;
      colorElement.setAttribute('data-color-index', index);
      colorsContainer.appendChild(colorElement);
    });

    updateVisibility();
  }

  function updatePaletteDisplay() {
    if (selectedPalette) {
      paletteContainer.textContent = selectedPalette;
    }
    updateVisibility();
  }

  function togglePopup(show) {
    if (show === undefined) {
      isActive = !isActive;
    } else {
      isActive = show;
    }

    if (isActive) {
      popupProductSelect.classList.add('active');
    } else {
      popupProductSelect.classList.remove('active');
    }
  }

  function handleClickOutside(event) {
    if (popupProductSelect && !popupProductSelect.contains(event.target)) {
      togglePopup(false);
    }
  }

  function syncCheckboxes() {
    checkboxes.forEach(checkbox => {
      const checkboxValue = checkbox.getAttribute('value');
      const isSelected = selectedColors.some(color => color.value === checkboxValue);
      checkbox.checked = isSelected;

      const label = checkbox.closest('.checkbox');
      if (label) {
        if (isSelected) {
          label.classList.add('filled');
        } else {
          label.classList.remove('filled');
        }
      }
    });
  }

  function addColor(colorValue, colorText) {
    if (selectedColors.some(color => color.value === colorValue)) {
      return;
    }

    const newColor = { value: colorValue, text: colorText };

    if (selectedColors.length >= maxColors && maxColors > 0) {
      selectedColors.shift();
      selectedColors.push(newColor);
    } else {
      selectedColors.push(newColor);
    }

    syncCheckboxes();
    updateColorsDisplay();
  }

  function removeColor(colorValue) {
    const index = selectedColors.findIndex(color => color.value === colorValue);
    if (index !== -1) {
      selectedColors.splice(index, 1);
      syncCheckboxes();
      updateColorsDisplay();
    }
  }

  const checkboxes = document.querySelectorAll('.checkbox__input');

  checkboxes.forEach(checkbox => {
    const checkboxValue = checkbox.getAttribute('value');
    const checkboxItem = checkbox.closest('.checkbox');
    const textElement = checkboxItem.querySelector('.checkbox__text');
    const colorText = textElement ? textElement.textContent : '';

    checkbox.addEventListener('change', function () {
      maxColors = getMaxColors();

      if (this.checked) {
        addColor(checkboxValue, colorText);
      } else {
        removeColor(checkboxValue);
      }
    });
  });

  paletteOptions.forEach(option => {
    const radioInput = option.querySelector('.options2__input');
    const textElement = option.querySelector('.options2__text');

    radioInput.addEventListener('change', function () {
      if (this.checked) {
        selectedPalette = textElement.textContent;
        updatePaletteDisplay();
      }
    });
  });

  if (trashBtn) {
    trashBtn.addEventListener('click', function (e) {
      e.stopPropagation();

      selectedColors = [];
      selectedPalette = null;

      paletteOptions.forEach(option => {
        const radioInput = option.querySelector('.options2__input');
        if (radioInput) {
          radioInput.checked = false;
        }
      });

      syncCheckboxes();
      paletteContainer.textContent = '';

      updateColorsDisplay();
      updatePaletteDisplay();
    });
  }

  if (productButton) {
    productButton.addEventListener('click', function (e) {
      e.stopPropagation();

      if (!e.target.closest('.popup-product-button__trash')) {
        togglePopup();
      }
    });
  }

  document.addEventListener('click', handleClickOutside);

  if (dropdown) {
    dropdown.addEventListener('click', function (e) {
      e.stopPropagation();
    });
  }

  function initializeFromExisting() {
    const checkedPalette = document.querySelector('[data-palette] .options2__input:checked');
    if (checkedPalette) {
      const parentOption = checkedPalette.closest('.options2__item');
      const textElement = parentOption.querySelector('.options2__text');
      if (textElement) {
        selectedPalette = textElement.textContent;
        updatePaletteDisplay();
      }
    }

    const checkedCheckboxes = document.querySelectorAll('.checkbox__input:checked');
    const currentMax = getMaxColors();

    selectedColors = [];

    checkedCheckboxes.forEach((checkbox, index) => {
      if (selectedColors.length < currentMax) {
        const checkboxValue = checkbox.getAttribute('value');
        const checkboxItem = checkbox.closest('.checkbox');
        const textElement = checkboxItem.querySelector('.checkbox__text');
        const colorText = textElement ? textElement.textContent : '';

        if (checkboxValue) {
          selectedColors.push({ value: checkboxValue, text: colorText });
        }
      } else {
        checkbox.checked = false;
      }
    });

    syncCheckboxes();
    updateColorsDisplay();
    togglePopup(false);
  }

  initializeFromExisting();
}