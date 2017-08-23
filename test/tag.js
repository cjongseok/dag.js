const deepEqual = require('deep-equal');
const Dag = require('..');
const expect = require('chai').expect;

describe('Tag Operation Test', () => {
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let E;

    beforeEach(() => {
      dag = new Dag();
      E = [];
      E.push({ from: 'a', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'b', to: 'c', tags: ['friend', 'follows'], weight: undefined });
      E.push({ from: 'd', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'a', to: 'd', tags: ['friend', 'follows'], weight: undefined });
      E.forEach(e => dag.add(e.from, e.to, e.tags, e.weight));
    });

    it('should have 2 edges by a tag, "follows"', () => {
      dag.tagSize('follows').should.equal(2);
    });

    it('should have no edges by a tag, "parent"', () => {
      dag.tagSize('parent').should.equal(0);
    });

    it('should have 3 verticies by a tag, "follows"', () => {
      dag.tagOrder('follows').should.equal(4);
    });

    it('should have no verticies by a tag, "parent"', () => {
      dag.tagOrder('parent').should.equal(0);
    });

    it('should have 2 tags by a tag, "follows"', () => {
      dag.tagKind('follows').should.equal(2);
    });

    it('should have no tags by a tag, "parent"', () => {
      dag.tagKind('parent').should.equal(0);
    });

    it('should filter by a tag, "friend"', () => {
      const filtered = dag.filterByTag('friend');
      // TODO: test it
      // TODO: filtered.deep.equal(dag);
      filtered.should.not.equal(dag);
      deepEqual(filtered, dag).should.equal(true);
      filtered.V.should.deep.equal(dag.V);
      filtered.E.should.deep.equal(dag.E);
      filtered.T.should.deep.equal(dag.T);
    });

    it('should filter by a tag, "follows"', () => {
      const filtered = dag.filterByTag('follows');

      filtered.size.should.equal(2);
      filtered.order.should.equal(4);
      filtered.kind.should.equal(2);
      filtered.edge('b', 'c').should.not.equal(dag.edge('b', 'c'));
      filtered.edge('b', 'c').should.deep.equal(dag.edge('b', 'c'));
      filtered.edge('a', 'd').should.not.equal(dag.edge('a', 'd'));
      filtered.edge('a', 'd').should.deep.equal(dag.edge('a', 'd'));
    });

    it('should not fileter by a tag, "parent"', () => expect(dag.filterByTag('parent')).to.be.undefined);
  });
});
