const assert = require('assert');
const { classd, classDedupe } = require('../lib');

describe ('classd', function () {
    it ('should return empty string when passed empty string', function () {
        return assert.equal(
            classd``,
            ''
        );
    });

    it ('should not let falsy values pass', function () {
        return assert.equal(
            classd`a ${false} b ${null} c ${undefined} d ${NaN}`,
            'a b c d'
        );
    });

    it ('should not convert booleans to strings', function () {
        return assert.equal(
            classd`${true} ${false}`,
            ''
        );
    });

    it ('should let 0 pass however (usecase padding-0, margin-0 etc)', function () {
        return assert.equal(
            classd`padding-${0}`,
            'padding-0'
        );
    });

    it ('should remove extra whitespaces', function () {
        return assert.equal(
            classd`  a \n b c  \t  d  `,
            'a b c d'
        );
    });

    it ('should accept arrays', function () {
        return assert.equal(
            classd`a ${[0, 1, 'b', 'c', ' ', NaN]}`,
            'a 0 1 b c'
        );
    });

    it ('should merge multiple array arguments', function () {
        return assert.equal(
            classd`${['a', 'b']} ${['c', 'd']}`,
            'a b c d'
        );
    });

    it ('should handle empty arrays', function () {
        return assert.equal(
            classd`${[]}`,
            ''
        );
    });

    it ('should handle nested empty arrays', function () {
        return assert.equal(
            classd`${[[]]}`,
            ''
        );
    });

    it ('should flatten arrays', function () {
        return assert.equal(
            classd`a ${[0, [1, [2, 3, [4]]]]}`,
            'a 0 1 2 3 4'
        );
    });

    it ('should pass object keys with truthy values', function () {
        return assert.equal(
            classd`a ${{
                b:1,
                c:0,
                d:null,
                e:true,
                f:'exists',
                g:NaN,
                h: 1==1,
                i: 1==0,
                j: '',
                k: [],
                l: {},
            }}`,
            'a b e f h k l'
        );
    });

    it ('should accept functions and call them without args', function () {
        return assert.equal(
            classd`padding-${_ => 0} margin-${x => x}`,
            'padding-0 margin-'
        );
    });

    it ('should ignore functions that throw errors', function () {
        return assert.equal(
            classd`a ${_ => { throw 0; }}`,
            'a'
        );
    });

    it ('should handle Maps', function () {
        const classMap = new Map;
        classMap.set('a', true);
        classMap.set('b', 0);
        classMap.set('c', []);
        classMap.set('d', null);

        return assert.equal(
            classd`${classMap}`,
            'a c'
        );
    });

    it ('should handle Sets', function () {
        const classSet = new Set;
        classSet.add('a');
        classSet.add('b');
        classSet.add('c');

        return assert.equal(
            classd`${classSet}`,
            'a b c'
        );
    });
});

describe ('classDedupe', function () {
    it ('should dedupe class name strings', function () {
        return assert.equal(
            classDedupe`a a b c a c d`,
            'a b c d'
        );
    });

    it ('should dedupe strings obtained from arrays, objects, functions', function () {
        return assert.equal(
            classDedupe`a ${['a', 'b', ['d']]} ${{ b:1, c:1 }} ${_ => 'd'} `,
            'a b d c'
        );
    });
});
