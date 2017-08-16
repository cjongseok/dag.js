'use strict'
let chai = require('chai');
let Dag = require('..');
let should = chai.should();
let expect = chai.expect;
let deepEqual = require('deep-equal');

describe('Removal Test', () =>{
    describe('DAG(order=4, size=4)', () => {
        let dag, V, E;

        beforeEach(()=>{
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            E = [];
            E.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            E.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'a', to:'d', tags: ['friend', 'follows', 'like'], weight: undefined});
            E.forEach(e => {dag.add(e.from, e.to, e.tags, e.weight)});
        });

        it('should remove each edge', () => {
            E.forEach((edge, index) => {
                // clone dag and E
                let removedDag = dag.deepClone();
                let removedE = E.slice(0);

                // remove from clones
                removedDag.removeEdge(edge.from, edge.to);
                removedE.splice(index, 1);

                // check the removal
                removedDag.size.should.equal(removedE.length);
                removedE.forEach(e => {removedDag.includes(e.from, e.to).should.equal(true);});
            });
        });

        it('should not remove an edge (e, b) with unknown vertex \'e\'', () => {
            let removedDag = dag.deepClone();
            removedDag.removeEdge('e', 'b');
            deepEqual(dag, removedDag).should.equal(true);
        });

        it('should not remove non-exist edge (d, a)', () => {
            let removedDag = dag.deepClone();
            removedDag.removeEdge('d', 'a');
            deepEqual(dag, removedDag).should.equal(true);
        });

        it('should remove a dangling tag \'like\' on removal of (a, d))', () => {
            let removedDag = dag.deepClone();
            removedDag.removeEdge('a', 'd');
            removedDag.kind.should.equal(2);
            removedDag.tagSize('kind').should.equal(0);
        });

        it('should remove each vertex', () => {
            V.forEach((vertex, index) => {
                // clone dag and E
                let removedDag = dag.deepClone();
                let removedV = [];
                let removedE = E.slice(0);

                // remove from clones
                removedDag.removeVertex(vertex);
                removedE = removedE.filter(e => {return e.from !== vertex && e.to !== vertex;});
                removedE.forEach(e => {
                    if(!removedV.includes(e.from))
                        removedV.push(e.from);
                    if(!removedV.includes(e.to))
                        removedV.push(e.to);
                });

                // check the removal
                removedDag.order.should.equal(removedV.length);
                removedDag.V.forEach(v => {removedV.should.includes(v);});
                removedDag.size.should.equal(removedE.length);
                removedE.forEach(e => {removedDag.edge(e.from, e.to).should.deep.equal(e);});
                
            });
        });

        // tag removal
    });
});
