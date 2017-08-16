# dag.js

[![npm version](https://badge.fury.io/js/dagjs.svg)](https://badge.fury.io/js/dagjs)
[![Build Status](https://travis-ci.org/cjongseok/dag.js.svg?branch=master)](https://travis-ci.org/cjongseok/dag.js)
[![Coverage Status](https://coveralls.io/repos/github/cjongseok/dag.js/badge.svg?branch=master)](https://coveralls.io/github/cjongseok/dag.js?branch=master)

Simple DAG (Directed Acyclic Graph) module with edge tagging.


### Usage
```javascript
let Dag = require('dag');

let dag = new Dag();
// ...
```

### Examples

Adding edges:
```javascript
let dag = new Dag();
// add(from, to, tags, weight)
dag.add('Mike', 'Josh', 'follows', 3);
dag.add('Mary', 'Josh', ['follows', 'likes'], 50);
dag.add('Josh', 'John', ['follows', 'admires']);
dag.add('Mike', 'Mary', 'likes', 100);
// It results in a DAG:
//           follows        admires
//     Mike ----3---> Josh --------> John
//       |             ^
//       |             |
//       |            50 follows and likes
//       |   likes     |
//       -----100---> Mary
```


Filtering by tag:
```javascript
let likeDag = dag.filterByTag('likes');
// likeDag =
//       likes         follows and likes
// Mike --100--> Mary ---------50--------> Josh
```

Neighbouring:
```javascript
let edgesToJosh = dag.edgesTo('Josh');
// edgesToJosh =
// [
//      {from:'Mike', to:'Josh', tags:['follows'], weight:3},
//      {from: 'Mary', to:'Josh', tags:['follows', 'likes'], weight: 50}
// ]

let edgesFromMary = dag.edgesFrom('Mary');
// edgesFromMary =
// [
//      {from: 'Mary', to:'Josh', tags:['follows', 'likes'], weight: 50}
// ]

let neighbourhoodOfJosh = dag.neighbourhood('Josh');
// neighbourhoodOfJosh =
//           follows        admires
//     Mike ----3---> Josh --------> John
//                     ^
//                     |
//                    50 follows and likes
//                     |
//                    Mary
```

Clones:
```javascript
// shallow-clone
let shallowDag = dag.clone();

// deep-clone
let deepDag = dag.deepClone();
```
