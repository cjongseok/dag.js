'use strict'
let chai = require('chai');
let Dag = require('..');
let should = chai.should();

describe('Line-DAG with ', () =>{
    describe('DAG(order=4, size=4)', () => {
        let dag, V, E;
        let lineDag, lineV, lineE;

        beforeEach(()=>{
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            E = [];
            E.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            E.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
            E.forEach(e => {dag.add(e.from, e.to, e.tags, e.weight)});

            lineDag = new Dag();
            lineV = ['a,d', 'a,b', 'd,b', 'b,c'];
            lineE = [];
            lineE.push({from:'a,d', to:'d,b', tags: [], weight: undefined});
            lineE.push({from:'d,b', to:'b,c', tags: [], weight: undefined});
            lineE.push({from:'a,b', to:'b,c', tags: [], weight: undefined});
        });

        it('should has line DAG', () => {
            let lined = dag.lineDag();
            lined.order.should.equal(lineDag.order);
            lined.size.should.equal(lineDag.size);
            lined.V.should.deep.equal(lineDag.V);
            // test below and choose one
            lined.E.should.deep.equal(lineDag.E);
            //lineE.forEach(e => {lined.should.include(e);});
        });
    });
});
