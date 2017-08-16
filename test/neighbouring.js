'use strict'
let chai = require('chai');
let Dag = require('..');
let should = chai.should();
let expect = chai.expect;
let deepEqual = require('deep-equal');

describe('Neighbouring Test', () =>{
    describe('DAG(order=4, size=4)', () => {
        let dag, V, E;
        let bNeighborDag, bNeighborV, bNeighborE;
        let aNeighborDag, aNeighborV, aNeighborE;

        beforeEach(()=>{
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            E = [];
            E.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            E.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
            E.forEach(e => {dag.add(e.from, e.to, e.tags, e.weight)});

            bNeighborDag = new Dag();
            bNeighborV = ['a', 'b', 'c'];
            bNeighborE = [];
            bNeighborE.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            bNeighborE.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            bNeighborE.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            bNeighborE.forEach(e => {bNeighborDag.add(e.from, e.to, e.tags, e.weight)});

            aNeighborDag = new Dag();
            aNeighborV = ['a', 'b', 'd'];
            aNeighborE = [];
            aNeighborE.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            aNeighborE.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
            aNeighborE.forEach(e => {aNeighborDag.add(e.from, e.to, e.tags, e.weight)});
        });

        it('should have two edges from \'a\'', () => {
            let actual = dag.edgesFrom('a');
            let expected = E.filter(e => {return e.from === 'a';});
            expect(actual.length).to.equal(expected.legnth);
            expected.forEach(e => {actual.edge(e.from, e.to).should.deep.equal(e);});
        });

        it('should not have an edge from \'c\'', () =>{
            let actual = dag.edgesFrom('c');
            let emptyDag = new Dag();
            deepEqual(actual, emptyDag).should.equal(true);
        });

        it('should have two edges to \'b\'', () => {
            let actual = dag.edgesTo('b');
            let expected = E.filter(e => {return e.to === 'b';});
            expect(actual.length).to.equal(expected.legnth);
            expected.forEach(e => {actual.edge(e.from, e.to).should.deep.equal(e);});
        });

        it('should not have an edge to \'a\'', () =>{
            let actual = dag.edgesTo('a');
            let emptyDag = new Dag();
            deepEqual(actual, emptyDag).should.equal(true);
        });

        it('should be same with its neighbourhood of \'b\'', () => {
            deepEqual(dag, dag.neighbourhood('b')).should.equal(false);
            deepEqual(aNeighborDag, dag.neighbourhood('b')).should.equal(false);
            deepEqual(bNeighborDag, dag.neighbourhood('b')).should.equal(true);
        });

        it('should not be same with its neighbourhood of \'a\'', () =>{
            deepEqual(dag, dag.neighbourhood('a')).should.equal(false);
            deepEqual(aNeighborDag, dag.neighbourhood('a')).should.equal(true);
            deepEqual(bNeighborDag, dag.neighbourhood('a')).should.equal(false);
        });
    });
});
