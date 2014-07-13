/**
 * @author Sergey Bondarenko <broken@propeople.com.ua>
 * @version 0.0.1
 *
 * GitHub: {@link https://github.com/BR0kEN-/po.js}
 * Updated: July 13, 2014
 *
 * @param {Window} W
 *   The global "window" object.
 *
 * @param {String} _
 *   The name of the library.
 *
 * @return {Void}
 */
;(function(W, _) {
  /**
   * Use strict mode to avoid errors.
   * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode}
   */
  'use strict';

  /**
   * @private
   */
  var /**
       * Method for attaching events.
       * @type {String}
       */
      eventMethod = 'addEventListener',
      /**
       * An event which we will listen.
       * @type {String}
       */
      eventName = 'load',
      /**
       * Indicates whether the translation is taken from the cache.
       * @type {Boolean}
       */
      from_storage = false,
      /**
       * Сhecks the availability of localStorage.
       * @return {Boolean|localStorage}
       */
      storage = function() {
        if ('localStorage' in W) {
          return localStorage;
        }

        return false;
      }(),
      /**
       * Create instance of object for AJAX queries.
       * @return {Boolean|XMLHttpRequest|ActiveXObject}
       */
      XHRObject = function() {
        try {
          return new XMLHttpRequest;
        } catch (e) {
          try {
            /**
             * If we cannot create an instance of XMLHttpRequest, then
             * likely we cannot use the "addEventListener" for attaching
             * events and due to that we will use the "attachEvent";
             * @type {String}
             */
            eventMethod = 'attachEvent';
            /**
             * Modifying an event name due to previous description.
             * @type {String}
             */
            eventName = 'on' + eventName;

            return new ActiveXObject('Microsoft.XMLHTTP');
          } catch (e) {
            return false;
          }
        }
      }(),
      /**
       * Replacing the text from library if it exists.
       *
       * @param {String} text
       *   Text which will be replaced.
       *
       * @param {Array} items
       *   An array of items, which will be replaced to "%s" placeholders.
       *
       * @return {String}
       *   Modified text
       */
      translate = function(text, items) {
        text = translate.translations[text] || text;

        if (items && items.constructor === Array && items.length) {
          for (var item in items) {
            text = text.replace(/%s/, items[item]);
          }
        }

        return text;
      };

  /**
   * Get the JSON file from server and cache it into
   * "localStorage" if there is that possibility.
   *
   * @param {String} locale
   *   Path to JSON file with translations.
   *
   * @return {Void}
   */
  translate.locale = function(locale) {
    var storage_key = _ + '_' + locale;

    if (storage) {
      translate.translations = storage.getItem(storage_key);
      from_storage = true;
    }

    if (XHRObject && !translate.translations) {
      from_storage = false;

      XHRObject.open('GET', locale + '.json', true);
      XHRObject.onreadystatechange = function() {
        if (this.response && !translate.translations) {
          translate.translations = this.response;

          if (storage) {
            storage.setItem(storage_key, translate.translations);
          }
        }
      };

      XHRObject.send();
    }

    translate.translations = JSON.parse(translate.translations);
  };

  /**
   * Trying to translate the text after we convinced that the file was loaded.
   *
   * @param {Function} callback
   *   Function which will be executed after loading the file with translations.
   *
   * @return {Void}
   */
  translate.ready = function(callback) {
    if (typeof callback === 'function') {
      from_storage ? callback() : XHRObject[eventMethod](eventName, callback, false);
    }
  };

  /**
   * @global
   * Create a global object on a name basis of library.
   */
  W[_] = translate;
})(this, 'pojs');
