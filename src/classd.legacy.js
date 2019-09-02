/*!
  Copyright (c) 2019 Ganesh Prasad.
  Licensed under the MIT License (MIT), see
  https://github.com/GnsP/classd
*/

import { names, trim } from './base';

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

export { classdFn, classDedupeFn };
