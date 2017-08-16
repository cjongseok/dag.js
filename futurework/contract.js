'use strict'
let chai = require('chai');
let Dag = require('..');
let should = chai.should();

describe('Edge contraction with ', () =>{
    describe('DAG(order=4, size=4)', () => {
        let dag, V, E;
        let contractDag, contractV, contractE;

        beforeEach(()=>{
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            E = [];
            E.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            E.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
            E.forEach(e => {dag.add(e.from, e.to, e.tags, e.weight)});

            contractDag = new Dag();
            contractV = ['a', 'c', 'd'];
            contractE = [];
            contractE.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            contractE.push({from:'d', to:'c', tags: ['friend', 'follows'], weight: undefined});
            contractE.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
        });

        it('should contract the edge, d->b', () => {
            let contracted = dag.contractEdge('d', 'b');
            contracted.order.should.equal(contractDag.order);
            contracted.size.should.equal(contractDag.size);
            contracted.V.should.deep.equal(contractDag.V);
            // test below and choose one
            contracted.E.should.deep.equal(contractDag.E);
            contractE.forEach(e => {contracted.includee.should.equal(true);});
        });
    });
});
