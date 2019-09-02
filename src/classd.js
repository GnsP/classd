/*!
  Copyright (c) 2019 Ganesh Prasad.
  Licensed under the MIT License (MIT), see
  https://github.com/GnsP/classd
*/

import { trim, names } from './base';

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

export { classd, classDedupe };
