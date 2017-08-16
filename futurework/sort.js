'use strict'
let chai = require('chai');
let Dag = require('..');
let should = chai.should();
let expect = chai.expect;

describe('Topological sort with ', () =>{
    describe('DAG(order=4, size=4)', () => {
        let dag, V, E;

        beforeEach(()=>{
            dag = new Dag();
            V = ['a', 'b', 'c', 'd'];
            E = [];
            E.push({from:'a', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'b', to:'c', tags: ['friend', 'follows'], weight: undefined});
            E.push({from:'d', to:'b', tags: ['friend'], weight: undefined});
            E.push({from:'a', to:'d', tags: ['friend', 'follows'], weight: undefined});
            E.forEach(e => {dag.add(e.from, e.to, e.tags, e.weight)});
        });

        it('should be [a, d, b, c]', () => {
            let sorted = ['a', 'd', 'b', 'c'];
            dag.topologicalSort().should.equal(sorted);
        });
        
        describe(' splitted by the tag, \'follows\', should be [b, c] and [a, d]', () => {
            it('should run topological sort', () => {
                let followsDags = dag.splitByTag('follows');
                expect(followsDags[0]).to.equal(['b', 'c']);
                expect(followsDags[1]).equal(['a', 'd']);
            });
        });
    });
});
