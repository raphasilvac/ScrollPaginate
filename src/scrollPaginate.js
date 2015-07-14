(function (global, doc) {
  'use strict';

  // Utils
  // Debouce function
  // inpired by David Walsh solution (http://davidwalsh.name/javascript-debounce-function)
  var debounce = function (func, wait) {
    var timeout;
    return function() {
      var _this = this,
        args = arguments,
        later = function() {
          timeout = null;
          func.apply(_this, args);
        };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    }
  };

  var sPaginate = function () {};

  sPaginate.create = function (config) {
    var instance = new this();
    instance.init(config);
    return instance;
  };

  sPaginate.prototype.init = function(config) {
    this.currentPage = 1;
    this.lastDiff = 0;
    this.listeners = [];
    this.config = config;
    this.selector = config.selector;
    this.debounceTime = config.debounceTime || 200;
    this.isWindowElement = (typeof this.selector === 'string' && !!this.selector.match(/html|body/));
    this.element = this.isWindowElement ? global : typeof this.selector === 'string' ? doc.querySelector(this.selector) : this.selector; 
    
    if(this.config.listener) {
      this.addListener(this.config.listener);
    }

    this.bindEvents();
  };

  sPaginate.prototype.bindEvents = function () {
    var _this = this;
    this.element.addEventListener('scroll', debounce(this.scroll.bind(_this), this.debounceTime));
  };

  sPaginate.prototype.addListener = function (func) {
    this.listeners.push(func);
  };

  sPaginate.prototype.cleanListeners = function (func) {
    this.listeners = [];
  };

  sPaginate.prototype.callListeners = function (page) {
    var listeners = this.listeners;

    listeners.forEach(function (listener) {
      listener(page);
    });
  };

  sPaginate.prototype.scroll = function () {
    var scrollHeight = this.isWindowElement ? doc.body.scrollHeight : this.element.scrollHeight,
      currentPosition = this.element.scrollY || this.element.scrollTop,
      isNextPageEnable = false,
      diff, height;

    height = this.element.offsetHeight || this.element.innerHeight;
    diff = scrollHeight - height;

    isNextPageEnable = ((diff - this.config.decrease) <= currentPosition && this.lastDiff !== diff);

    if(isNextPageEnable) {
      this.lastDiff = diff;
      this.nextPage();
    }
  };

  sPaginate.prototype.nextPage = function () {
    this.callListeners(this.currentPage);
    this.currentPage +=1;
  }

  global.ScrollPaginate = sPaginate;

}(window, document));

