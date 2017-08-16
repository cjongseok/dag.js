'use strict'

//import CycleError from 'cycle-error';
let CycleError = require('./cycle-error');

class Dag {
    constructor(){
        this.edges = [];   
        this.tagObjs = new Object();
        this.tagInvertedIndex = new Object();
    }
  
    get T(){
        return Object.keys(this.tagObjs).reduce((previous, tag) => {return previous.concat([tag]);}, []);
    }

    get E(){
        let edges = [];
        Object.keys(this.edges).forEach(to => {
            this.edges[to].forEach(edge => {edges.push(this.edge(edge.f, to))});
        });
        return edges;
    }
    
    get V(){
        let verticies = Object.keys(this.edges).reduce((previous, key) => {
            if(this.edges[key].length > 0){
                if(!previous.includes(key))
                    previous.push(key);
                this.edges[key].forEach(e => {
                    if(!previous.includes(e.f))
                        previous.push(e.f);
                })
            }
            return previous;
        }, []);
        return verticies;
    }

    get kind(){
        let tags = this.T;
        return tags.length;
    }

    get order(){
        let verticies = this.V;        
        return verticies.length;
    }

    get size(){
        return Object.keys(this.edges).reduce((previous, key) => {
            return previous + this.edges[key].length;
        }, 0);
    }
/*
    recursiveStringify(obj, depth=0) {
        if(obj == undefined)
            return;
        var objKeys = Object.keys(obj);
        var keyValueArray = new Array();
        for (var i = 0; i < objKeys.length; i++) {
            var keyValueString = '"' + objKeys[i] + '":';
            var objValue = obj[objKeys[i]];
            keyValueString = (typeof objValue == "string") ? 
                keyValueString = keyValueString + '"' + objValue + '"' : 
                keyValueString = keyValueString + this.recursiveStringify(objValue, depth+1);
            keyValueArray.push(keyValueString);
        }
        let indent = "";
        const tab = "  ";
        for(i=0; i<depth; i++)
            indent += tab;
        if(Array.isArray(obj))
            return tab + "[\n" + 
                indent+ tab + keyValueArray.join("," + "\n" + indent + tab) + "\n" +
                indent + "]";
        else
            return tab + "{\n" + 
                indent+ tab + keyValueArray.join("," + "\n" + indent + tab) + "\n" +
                indent + "}";
    }

    get json(){
        return this.recursiveStringify(this);
    }

    debug(){
        console.log(this.json);
    }
    */

    edge(from, to){
        if(this.edges[to] !== undefined){
            let edge = this.edges[to].find(e => {return e.f === from});
            if(edge !== undefined)
                return {
                    from: edge.f,
                    to: to,
                    weight: edge.w,
                    tags: edge.ts.reduce((previous, tagObject) => {return previous.concat([tagObject.name]);}, [])
                }
        }
        return undefined;
    }

    includes(from, to){
        return this.edge(from, to) !== undefined;
    }


    add(from, to, tags, weight){
        // test cycle
        if(this.testCycle(from, to))
            throw new CycleError();

        // instantiate tags, if not exist
        if(!Array.isArray(tags))
            tags = [tags];
        tags.forEach(tag => {
            if(!(tag in this.tagObjs))
                this.tagObjs[tag] = {name: tag};
        });

        // instantiate an edge
        let edge = {
            f: from,
            w: weight,
            ts: tags.reduce((previous, tag) => {return previous.concat([this.tagObjs[tag]]);}, [])
        };
        
        // register the edge
        if(this.edges[to] === undefined)
            this.edges[to] = [];
        this.edges[to].push(edge);
        tags.forEach(tag => {
            if(!(tag in this.tagInvertedIndex))
                this.tagInvertedIndex[tag] = new Object();
            if(!(to in this.tagInvertedIndex[tag]))
                this.tagInvertedIndex[tag][to] = [];
            this.tagInvertedIndex[tag][to].push(edge);
        });

        return this;
    }

    /**
     * @param {string} start - starting point of reverse-BFS
     * @callback hitCondition - condition to stop traversal 
     * @callback callback - task to do for each visit. The visit stopping the traversal is exclusive.
     */
    reverseBFS(start, hitCondition, callback){
        let q = [start];
        while(q.length > 0){
            let visit = q.shift();
            if(hitCondition !== undefined && hitCondition(visit))
                return visit;
            if(callback !== undefined)
                callback(visit);
            if(this.edges[visit] !== undefined){
                this.edges[visit].forEach(e => {q.push(e.f)});
            }
        }
        return undefined;
    }

    /**
     * @return {boolean}    true, if (@code{from}, @code{to}) makes a cycle. false, otherwise.
     */
    testCycle(from, to){
        if(from === to)
            return true;
        let hit = this.reverseBFS(from, v => {return v === to;});
        if(hit === undefined)
            return false;
        return true;
    }

    // clone
    /**
     * Shallow copy
     * @return new DAG instance which has new arrays (i.e., E, tagObjs, and tagInvertedIndex) but their elements (i.e. E['a'], ... and tagObjs['friend'], ...).
     */
    clone(){
        let newDag = new Dag();
        Object.keys(this.edges).forEach(key => {
            newDag.edges[key] = this.edges[key];
        });
        Object.keys(this.tagObjs).forEach(tag => {
            newDag.tagObjs[tag] = this.tagObjs[tag];
        });
        Object.keys(this.tagInvertedIndex).forEach(tag => {
            newDag.tagInvertedIndex[tag] = this.tagInvertedIndex[tag];
        });
        return newDag;
    }

    /**
     * Deep copy
     * @return new DAG instance without references from the original pieces, at all.
     */
    deepClone(){
        let newDag = new Dag();
        Object.keys(this.edges).forEach(to => {
            this.edges[to].forEach(e => {
                // clone the edge
                let clonedEdge =  {
                    f: e.f,
                    w: e.w,
                    ts: []
                };
                let tags = e.ts.reduce((previous, tagObj) => {
                    return previous.concat([tagObj.name]);
                }, []);
                newDag.add(e.f, to, tags, e.w);
            });
        });

        return newDag;
    }

    // neighbouring
    /** 
     * Edges comes from a vertex
     * @param {string} from     the vertex.
     * @returns {@type {Dag}}   deep cloned edges start at the vertex 'from'. 
     *                          empty DAG, if the vertex does not exist or there is no edges from it.
     */
    edgesFrom(from){
        let dag = new Dag();
        Object.keys(this.edges).forEach(key => {
            this.edges[key].forEach(e => {
                if(e.f === from){
                    let cloned = {from: e.f, to: key, weight: e.w};
                    cloned.tags = e.ts.reduce((previous, tagObject) => {return previous.concat([tagObject.name]);}, []);
                    dag.add(cloned.from, cloned.to, cloned.tags, cloned.weight);
                }
            });
        });   
        return dag;
    }

    /**
     * Edges go to a vertex
     * @param {string} to       the vertex.
     * @returns {@type {Dag}}   deep cloned edges end at the vertex 'to'.
     *                          empty DAG, if the vertex does not exist or there is no edges heading it.
     */
    edgesTo(to){
        if(undefined === this.edges[to])
            return new Dag();
        let dag = new Dag();
        this.edges[to].forEach(e => {
            let cloned = {from: e.f, to: to, weight: e.w};
            cloned.tags = e.ts.reduce((previous, tagObject) => {return previous.concat([tagObject.name]);}, []);
            dag.add(cloned.from, cloned.to, cloned.tags, cloned.weight);
        });
        return dag;
    }

    /**
     * sub-DAG whoes edges are around a vertex
     * @param {string} vertex   the vertex.
     * @returns {Object}        deep cloned DAG where all the edges relate with the vertex.
     *                          empty DAG, if the vertex does not exist or there is no edges around it.
     */
    neighbourhood(vertex){
        let dag = this.edgesFrom(vertex);
        if(undefined === this.edges[vertex])
            return dag;
        this.edges[vertex].forEach(e => {
            let cloned = {from: e.f, to: vertex, weight: e.w};
            cloned.tags = e.ts.reduce((previous, tagObject) => {return previous.concat([tagObject.name]);}, []);
            dag.add(cloned.from, cloned.to, cloned.tags, cloned.weight);
        });
        return dag;
    }

    // tag
    /*
     * Number of verticies with a tag
     * It counts the number of verticies connected by edges of the given tag.
     * In counting, it refers to this.tagInvertedIndex.
     * @param {string} tag  the tag.
     * @returns {number}    the number of verticies by 'tag'.
     **/
    tagOrder(tag){
        if(!(tag in this.tagInvertedIndex))
            return 0;

        let verticies = Object.keys(this.tagInvertedIndex[tag]).reduce((previous, to) => {
            if(this.tagInvertedIndex[tag][to].length > 0){
                if(!previous.includes(to))
                    previous.push(to);
                this.tagInvertedIndex[tag][to].forEach(e => {
                    if(!previous.includes(e.f))
                        previous.push(e.f);
                })
            }
            return previous;
        }, []);
        
        return verticies.length;
    }

    /*
     * Number of edges with a tag
     * It counts the number of edges filtered by the given tag.
     * In counting, it refers to this.tagInvertedIndex.
     * @param {string} tag  the tag.
     * @returns {number}    the number of edges by 'tag'.
     **/
    tagSize(tag){
        if(!(tag in this.tagInvertedIndex))
            return 0;

        return Object.keys(this.tagInvertedIndex[tag]).reduce((count, to) => {
            return count + this.tagInvertedIndex[tag][to].length;
        }, 0);
    }

    /*
     * Number of tags in edges with a tag
     * It counts the number of tags attached to the edges filtered by the given tag.
     * In counting, it refers to this.tagInvertedIndex.
     * @param {string} tag  the tag, which is inclusive to the count.
     * @returns {number}    the number of tags in edges by 'tag'.
     **/
    tagKind(tag){
        if(!(tag in this.tagInvertedIndex))
            return 0;

        let tags = Object.keys(this.tagInvertedIndex[tag]).reduce((previous, to) => {
            if(this.tagInvertedIndex[tag][to].length > 0){
                this.tagInvertedIndex[tag][to].forEach(e => {
                    e.ts.forEach(tagObj => {
                        if(!previous.includes(tagObj.name))
                            previous.push(tagObj.name);
                    })
                })
            }
            return previous;
        }, [tag]);

        return tags.length;
    }

    /*
     * Break DAG by a tag
     * @param {string} tag  A tag to split this DAG by
     * @returns {array}     A deep-cloned sub-DAG of itself, if there is an edge including 'tag'. Undefined, otherwise.
     **/
    filterByTag(tag){
        if(!(tag in this.tagInvertedIndex))
            return undefined;
        let filteredEdges = this.tagInvertedIndex[tag];

        let filtered = new Dag();
        Object.keys(filteredEdges).forEach(to => {
            filteredEdges[to].forEach(edge => {
                let cloned  = {from: edge.f, to: to, tags: [], weight: undefined};
                cloned.tags = edge.ts.reduce((previous, tagObj) => {return previous.concat([tagObj.name])}, []);
                filtered.add(cloned.from, cloned.to, cloned.tags, cloned.weight);
            });
        });

        return filtered;
    }


    // remove
    removeEdge(from, to){       
        if(!(to in this.edges))
            return this;

        // arrange edges
        let targetIndex = this.edges[to].findIndex(e => {return e.f === from;});
        if(targetIndex === -1)
            return this;
        let removed = this.edges[to].splice(targetIndex, 1)[0];
        if(this.edges[to].length === 0)
            delete this.edges[to];

        // arrange tag index
        removed.ts.forEach(tagObj => {
            this.tagInvertedIndex[tagObj.name][to] = 
                this.tagInvertedIndex[tagObj.name][to].filter(edge => {return edge.f !== from});
            if(this.tagInvertedIndex[tagObj.name][to].length === 0)
                delete this.tagInvertedIndex[tagObj.name][to];
        });

        // remove dangling tags 
        removed.ts.forEach(tagObj => {
            if(this.tagSize(tagObj.name) === 0){
                delete this.tagObjs[tagObj.name];
                delete this.tagInvertedIndex[tagObj.name];
            }
        });

        return this;
    }

    removeVertex(vertex){
        // remove edges 'to' the verted
        if(vertex in this.edges){
            // arrange edges
            delete this.edges[vertex];

            // arrange tag index
            Object.keys(this.tagInvertedIndex).forEach(tag => {
                delete this.tagInvertedIndex[tag][vertex];
            });
        }

        // remove edges 'from' the vertex
        Object.keys(this.edges).forEach(to => {
            // arrnage edges
            let tagsToRemove = [];
            this.edges[to] = this.edges[to].filter(e => {
                e.ts.forEach(tagObj => {
                    if(!tagsToRemove.includes(tagObj.name))
                        tagsToRemove.push(tagObj.name);
                });
                return e.f !== vertex;
            });
            if(this.edges[to].length === 0)
                delete this.edges[to];

            // arrange tag index
            tagsToRemove.forEach(tag => {
                this.tagInvertedIndex[tag][to] = this.tagInvertedIndex[tag][to].filter(e => {return e.f !== vertex});
                if(this.tagInvertedIndex[tag][to].length === 0)
                    delete this.tagInvertedIndex[tag][to];
            });
        });

        // remove dangling tags
        Object.keys(this.tagObjs).forEach(tag => {
            if(this.tagSize(tag) === 0){
                delete this.tagObjs[tag];
                delete this.tagInvertedIndex[tag];
            }
        });

        return this;
    }

    /*
    // sorting
    topologicalSort(){
        return [];
    }

    // sub-DAG
    since(from){return this;}
    until(to){return this;}

    // line graph
    lineDag(){return this;}

    // edge
    contractEdge(from, to){return this;}

    // ged
    //ged(dag, distAlg){}

    // serialize & deserialize
    */
}

module.exports = Dag;
