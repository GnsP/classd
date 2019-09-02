var suite = new Benchmark.Suite;
var outputNode = document.getElementById('output');

var benchmarkSuite = [
    ['a', 'b', 'c', 'c', 'd'],
    ['a', 1, 'c', 100+23, 'd'],
    ['a', undefined, NaN, null, 'b'],
    [''],
    [[]],
    ['a', ['b', ['c']]],
    ['a', { b:1, c:0, d:null}],
    [{ b:1, c:0, d:null}, {e:1, f:null, g:'a'}],
];

function useclassd () {
    var cn = classd.classd;
    return [
        cn`a b c c d`,
        cn`a ${1} c ${100+23} d`,
        cn`a ${undefined} ${NaN} ${null} b`,
        cn`${[]}`,
        cn`a ${['b', ['c']]}`,
        cn`a ${{b:1, c:0, d:null}}`,
        cn`${{b:1, c:0, d:null}} ${{e:1, f:null, g:'a'}}`
    ];
}

function useclassDedupe () {
    var cn = classd.classDedupe;
    return [
        cn`a b c c d`,
        cn`a ${1} c ${100+23} d`,
        cn`a ${undefined} ${NaN} ${null} b`,
        cn`${[]}`,
        cn`a ${['b', ['c']]}`,
        cn`a ${{b:1, c:0, d:null}}`,
        cn`${{b:1, c:0, d:null}} ${{e:1, f:null, g:'a'}}`
    ];
}

function useclassdFn () {
    benchmarkSuite.map(function (args) {
        classd.classdFn.apply(null, args);
    });
}

function useclassDedupeFn () {
    benchmarkSuite.map(function (args) {
        classd.classDedupeFn.apply(null, args);
    });
}

function useClassnames () {
    benchmarkSuite.map(function (args) {
        classNames.apply(null, args);
    });
}

function useClassnamesDedupe () {
    benchmarkSuite.map(function (args) {
        classNamesDedupe.apply(null, args);
    });
}

suite
.add('classd', useclassd)
.add('classDedupe', useclassDedupe)
.add('classdFn', useclassdFn)
.add('classDedupeFn', useclassDedupeFn)
.add('classnames', useClassnames)
.add('classnamesDedupe', useClassnamesDedupe)
.on('cycle', function(event) {
    outputNode.innerHTML += '<br>' + String(event.target);
    console.log(event);
})
.on('complete', function() {
    outputNode.innerHTML += '<br>' + 'Fastest is ' + this.filter('fastest').map('name');
})
.run({ 'async': true });
