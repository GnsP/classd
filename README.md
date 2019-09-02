# classd
A minimal ES6 utility to compose classnames

[![NPM version](https://badgen.net/npm/v/classd)](https://www.npmjs.com/package/classd)
[![NPM Weekly Downloads](https://badgen.net/npm/dw/classd)](https://www.npmjs.com/package/classd)
[![License](https://badgen.net/npm/license/classd)](https://www.npmjs.com/package/classd)

**classd** is a fast, minimal JavaScript(ES6) utility for composing class names. 
It builds on ideas and philosophy similar to that of [JedWatson's classnames](https://github.com/JedWatson/classnames). 
**classd defaults to the idea of using ES6 template literals for composing class names.** 
It also provides functions similar to `classNames` and `classNames/dedupe` for
compatibility (with a minor behavioural difference in case of `classNames/dedupe`; 
detailed in a subsequent section).

It exports 4 functions:

1. `classd` (Tag for template literals, default)
2. `classDedupe` (Tag for template literals)
3. `classdFn` (Variadic function, for compatibility, similar to `classNames`)
4. `classDedupeFn` (Variadic function, for compatibility, similar to `classNames/dedupe`)

### Installation

Install with [npm](https://www.npmjs.com/), or [Yarn](https://yarnpkg.com/):

```bash
# via npm
npm install --save classd

# or Yarn (note that it will automatically save the package to your `dependencies` in `package.json`)
yarn add classd
```

Use with ES6 modules (import)

```js
// IMPORTING IN ES6
///////////////////

// ES6 import (default - classd tag for template literals)
import classd from 'classd';

// example use
const width = 1080;
const classes = classd`container padding-${{
    lg: width > 1280, 
    md: width > 960 && width < 1280,
    sm: width <= 960
}} margin-0 ${width > 960 && 'blue'} ${width < 960 && 'red'}`;
console.log(classes); // => 'container padding-md margin-0 blue'


// ES6 import any of the exported functions
import { classd, classDedupe, classdFn, classDedupeFn } from 'classd';

// example use (of classdFn)
const width = 1080;
const classes = classdFn ('container', {
    'padding-lg': width > 1280, 
    'padding-md': width > 960 && width < 1280,
    'padding-sm': width <= 960
}, (width > 960 && 'blue'), 'margin-0');
console.log(classes); // => 'container padding-md blue margin-0'
```


Use with commonjs (require) 

```js
// REQUIRING IN COMMONJS
////////////////////////

// commonjs require classd tag for template literals (default export)
const classd = require('classd').default

// commonjs require any of the exported functions
const { classd, classDedupe, classdFn, classDedupeFn } = require('classd');

// commonjs require classd module
const classd = require('classd'); // exports can be used as classd.classd, classd.classDedupe etc
```


Use in browser (from CDN)

```html
// LOADING FROM CDN
///////////////////

<script src='https://cdn.jsdelivr.net/npm/classd@1.0/lib/index.js'></script>
<script type='text/javascript'>
    const { classd, classDedupe, classdFn, classDedupeFn } = window.classd;
    console.log(classd`container ${1 > 0 && 'blue'}`); // => 'container blue'
</script>
```

### Project philosophy

We take the stability and performance of this package seriously.  
Updates are thoroughly reviewed for performance impacts before being released.  
We maintain a comprehensive test suite.  
classd follows the [SemVer](https://semver.org/) standard for versioning.  
There is also a [Changelog](https://github.com/GnsP/classd/blob/master/CHANGELOG.md).


## Usage

### `classd` tag for template literals

The `classd` tag processes the interpolation values in the template literal according to the following specification.

+ Strings and numbers are valid values and are added to the output.
+ It drops `undefined`, `null`, `NaN` and `boolean` values.
+ If the value is an Array or an Iterable, it flattens the value and recursively processes the elements.
+ If the value is an Object or a Map, it drops keys associated with falsy values and adds the remaining keys to the output.
+ If the value is a function, it calls the function and adds its return value if that's valid
+ It removes all unnecessary whitespace.

**Examples**

```js
classd`foo bar`; // => 'foo bar'
classd`foo ${null && 'bar'}`; // => 'foo'
classd`foo-${true && 'bar'}`; // => 'foo-bar'
classd`${true} ${false}`; // => ''
classd`${{ foo: true, bar: false}}`; // => 'foo'
classd`${{foo: true}} ${{bar: true}} ${{baz: false}}`; // => 'foo bar'
classd`a ${[ 'b', 'c', false && 'd' ]}`; // => 'a b c'
classd`${['a', { b: 1, c: 0 }]}`; // 'a b'
classd`    a    b  \n  ${Array(10).fill(' ')} c`; // => 'a b c'
```

### `classdFn` function

The `classdFn` follows the same specifications as the `classd` tag. Everything that's valid with
`classNames` is also valid with `classdFn`. In addition, `classdFn` supports passing Maps, Sets,
and other Iterables as arguments.

```js
classdFn('foo', 'bar'); // => 'foo bar'
classdFn('foo', { bar: true }); // => 'foo bar'
classdFn({ 'foo-bar': true }); // => 'foo-bar'
classdFn({ 'foo-bar': false }); // => ''
classdFn({ foo: true }, { bar: true }); // => 'foo bar'
classdFn({ foo: true, bar: true }); // => 'foo bar'
classdFn('foo', { bar: true, duck: false }, 'baz', { quux: true }); // => 'foo bar baz quux'
classdFn(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // => 'bar 1'

var arr = ['b', { c: true, d: false }];
classdFn('a', arr); // => 'a b c'
```

### `classDedupe` tag for template literals and `classDedupeFn` function

The `classDedupe` tag is an enhanced and about 60% slower version of the `classd` tag.
It does everything that the `classd` tag does. In addition to that it checks for repeatations
in case of classnames and ensures that each valid classname appears only once in the output string.

The `classDedupeFn` is the function equivalent of the `classDedupe` tag.

It differs from the `classNames/dedupe` in the behaviour that, the `classNames/dedupe` unsets a class
if a configuration object appearing later in its arguments unsets it; whereas `classDedupe` does not
unset a classname once it's set.

```js

// classDedupe tag

classDedupe`a ${[ 'b', 'a', 'c' ]} c`; // => 'a b c'
classDedupe`${['a', { b: 1, a: 0 }]}`; // 'a b'

// classDedupeFn function

classDedupeFn('a', [ 'b', 'a', 'c' ], 'c b'); // => 'a b c'
classDedupeFn(['a', { b: 1, a: 0 }]); // 'a b'
```


### Example usage with React

The classNames way (**how to migrate to classd**):

```js

// before
// import classNames from 'classnames';

// after
import { classdFn } from 'classd';

class Button extends React.Component {
    // ...
    render () {

        // before
        // const btnClass = classNames({ ... });

        // after
        const btnClass = classdFn({
            btn: true,
            'btn-pressed': this.state.isPressed,
            'btn-over': !this.state.isPressed && this.state.isHovered
        });

        return <button className={btnClass}>{this.props.label}</button>;
    }
}
```

Using the `classd` tagged template literals:

```js
import classd from 'classd';

const btnClass = classd`btn ${this.props.className} ${{
  'btn-pressed': this.state.isPressed,
  'btn-over': !this.state.isPressed && this.state.isHovered
}}`;

// or maybe directly in JSX

<Button 
    className={classd`
        btn 
        ${this.props.className} 
        ${this.state.pressed && 'btn-pressed'}
        ${!this.state.pressed && this.state.isHovered && 'btn-over'}
    `}
> 
    {this.props.label} 
</Button>

```


## Polyfills needed to support older browsers

`Array.isArray`: see [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray) for details about unsupported older browsers (e.g. <= IE8) and a simple polyfill.



## License

[MIT](LICENSE). Copyright (c) 2019 Ganesh Prasad.
