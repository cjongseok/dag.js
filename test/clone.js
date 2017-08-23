const Dag = require('..');

describe('Clone Test', () => {
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

    it('should do shallow-clone', () => {
      const cloned = dag.clone();
      cloned.should.not.equal(dag);
      cloned.edges.should.not.equal(dag.edges);
      cloned.tagObjs.should.not.equal(dag.tagObjs);
      Object.keys(cloned.edges).forEach((key) => {
        cloned.edges[key].should.equal(dag.edges[key]);
      });
      Object.keys(cloned.tagObjs).forEach((tag) => {
        (tag in dag.tagObjs).should.equal(true);
        cloned.tagObjs[tag].should.equal(dag.tagObjs[tag]);
      });
    });

    it('should do deep-clone', () => {
      const cloned = dag.deepClone();
      cloned.should.not.equal(dag);
      cloned.edges.should.not.equal(dag.edges);
      cloned.tagObjs.should.not.equal(dag.tagObjs);
      Object.keys(cloned.edges).forEach((key) => {
        cloned.edges[key].should.not.equal(dag.edges[key]);
        cloned.edges[key].forEach((e, index) => {
          e.should.not.equal(dag.edges[key][index]);
          e.should.deep.equal(dag.edges[key][index]);
        });
      });
      Object.keys(cloned.tagObjs).forEach((tag) => {
        cloned.tagObjs[tag].should.not.equal(dag.tagObjs[tag]);
        cloned.tagObjs[tag].should.deep.equal(dag.tagObjs[tag]);
      });
    });
  });
});
