const Dag = require('..');

describe('Edge contraction with ', () =>{
  describe('DAG(order=4, size=4)', () => {
    let dag;
    let E;
    let contractDag;
    let contractE;

    beforeEach(()=>{
      dag = new Dag();
      E = [];
      E.push({ from: 'a', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'b', to: 'c', tags: ['friend', 'follows'], weight: undefined });
      E.push({ from: 'd', to: 'b', tags: ['friend'], weight: undefined });
      E.push({ from: 'a', to: 'd', tags: ['friend', 'follows'], weight: undefined });
      E.forEach(e => dag.add(e.from, e.to, e.tags, e.weight));

      contractDag = new Dag();
      contractE = [];
      contractE.push({ from: 'a', to: 'b', tags: ['friend'], weight: undefined });
      contractE.push({ from: 'd', to: 'c', tags: ['friend', 'follows'], weight: undefined });
      contractE.push({ from: 'a', to: 'd', tags: ['friend', 'follows'], weight: undefined });
    });

    it('should contract the edge, d->b', () => {
      const contracted = dag.contractEdge('d', 'b');
      contracted.order.should.equal(contractDag.order);
      contracted.size.should.equal(contractDag.size);
      contracted.V.should.deep.equal(contractDag.V);
      // test below and choose one
      contracted.E.should.deep.equal(contractDag.E);
      contractE.forEach(() => contracted.includee.should.equal(true));
    });
  });
});
