(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.classd = {}));
}(this, function (exports) { 'use strict';

  /*!
    Copyright (c) 2019 Ganesh Prasad.
    Licensed under the MIT License (MIT), see
    https://github.com/GnsP/classd
  */

  /**
   *  Safely call functions without any arguments
   *  @param {function} fn - any function, should return a string
   */
  function safecall(fn) {
      try {
          return fn.call(null).toString();
      } catch (err) {
          return '';
      }
  }

  /**
   * Convert the argument to a space separated list of classnames
   * - ignore falsy values (exception 0) and booleans
   * - flatten and concat arrays, lists, sets and other iterables
   * - recursively apply itself on elements of iterables
   * - in case of plain objects and Maps, ignore keys with falsy values
   * - in case of function, safecall it and return the result as string
   *
   * @param {*} value
   * @return {string} space separated list of names
   */
  function names(value) {
      var res = '';
      var hasOwn = {}.hasOwnProperty;

      if (typeof value === 'string') return value;else if (value === null || value === undefined || typeof value === 'boolean' || typeof value === 'number' && isNaN(value)) return '';else if (typeof value === 'function') return safecall(value);else if (typeof value === 'object') {
          if (Array.isArray(value)) {
              for (var i = 0; i < value.length; i++) res += ' ' + names.call(null, value[i]);
              return res;
          } else if (value instanceof Map) {
              for (let [key, val] of value) if (!!val) res += ' ' + key;
              return res;
          } else if (typeof value[Symbol.iterator] === 'function') {
              for (let val of value) res += ' ' + names.call(null, val);
              return res;
          } else {
              for (var key in value) if (hasOwn.call(value, key) && value[key]) res += ' ' + key;
              return res;
          }
      } else return value.toString();
  }

  /**
   *  Trim whitespace from both ends of the string and replace all remaining whitespaces with single spaces
   *  @param {string} str
   *  @return {string} string with whitespaces trimmed
   */
  function trim(str) {
      var res = '',
          prev = true,
          ch = '';
      for (var i = 0; i < str.length; i++) {
          ch = str.charAt(i);
          if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r' || ch === '\v') {
              if (!prev) prev = true;
          } else {
              if (res && prev) res += ' ';
              res += ch;
              prev = false;
          }
      }
      return res;
  }

  /*!
    Copyright (c) 2019 Ganesh Prasad.
    Licensed under the MIT License (MIT), see
    https://github.com/GnsP/classd
  */

  /**
   * Take a template literal and convert it to a valid classnames string
   * @param {string[]} strings
   * @param {*[]} values
   * @return {string} valid classnames string
   */
  function classd(strings, ...values) {
      var res = '';
      for (var i = 0; i < strings.length; i++) {
          res += strings[i];
          res += names.call(null, values[i]);
      }
      return trim.call(null, res);
  }

  /**
   * Take a template literal and convert it to a deduped classnames string
   * @param {string[]} strings
   * @param {*[]} values
   * @return {string} valid classnames string (deduped)
   */
  function classDedupe(strings, ...values) {
      var cache = new Set(),
          res = '',
          space = false;
      var classes = classd(strings, ...values).split(' ');
      for (var i = 0; i < classes.length; i++) {
          if (!cache.has(classes[i])) {
              if (space) res += ' ';
              res += classes[i];
              cache.add(classes[i]);
              space = true;
          }
      }
      return res;
  }

  /*!
    Copyright (c) 2019 Ganesh Prasad.
    Licensed under the MIT License (MIT), see
    https://github.com/GnsP/classd
  */

  /**
   * Combine arguments to a valid classnames string
   * @param {...*} values
   * @return {string} valid classnames string
   */
  function classdFn(...values) {
      var res = '';
      for (var i = 0; i < values.length; i++) {
          res += names.call(null, values[i]) + ' ';
      }
      return trim.call(null, res);
  }

  /**
   * Combine arguments to a deduped classnames string
   * @param {...*} values
   * @return {string} deduped classnames string
   */
  function classDedupeFn(...values) {
      var res = '',
          space = false,
          cache = new Set();
      var classes = classdFn(...values).split(' ');
      for (var i = 0; i < classes.length; i++) {
          if (!cache.has(classes[i])) {
              if (space) res += ' ';
              res += classes[i];
              cache.add(classes[i]);
              space = true;
          }
      }
      return res;
  }

  /*!
    Copyright (c) 2019 Ganesh Prasad.
    Licensed under the MIT License (MIT), see
    https://github.com/GnsP/classd
  */

  exports.classDedupe = classDedupe;
  exports.classDedupeFn = classDedupeFn;
  exports.classd = classd;
  exports.classdFn = classdFn;
  exports.default = classd;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
