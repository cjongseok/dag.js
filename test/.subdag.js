const deepEqual = require('deep-equal');
const Dag = require('..');
const should = require('chai').should();

describe('Sub-DAG from ', () =>{
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let V;
    let E;

    beforeEach(()=>{
      dag = new Dag();
      E = [];
      E.push({ from: 'a', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'b', to: 'c', tags: ['friend', 'follows'], weight: undefined });
      E.push({ from: 'd', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'a', to: 'd', tags: ['friend', 'follows'], weight: undefined });
      E.forEach(e => dag.add(e.from, e.to, e.tags, e.weight));
    });

    it('since \'a\' should be same with its original', () => {
      dag.should.not.equal(dag.since('a'));
      deepEqual(dag, dag.since('a')).should.equal(true);
    });

    it('since \'d\' should not be same with its original', () => {
      dag.should.not.equal(dag.since('d'));
      deepEqual(dag, dag.since('d')).should.equal(false);
    });

    it('until \'c\' should be same with its original', () => {
      dag.should.not.equal(dag.until('c'));
      deepEqual(dag, dag.until('c')).should.equal(true);
    });

    it('until \'b\' should not be same with its original', () => {
      dag.should.not.equal(dag.until('b'));
      deepEqual(dag, dag.until('b')).should.equal(false);
    });
  });
});
