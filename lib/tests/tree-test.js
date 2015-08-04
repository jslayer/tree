'use strict';

define(['tree'], function(Tree){
    describe('Tree simple', function(){
        it('Tree add (no arguments)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            assert.deepEqual(tree.children(), [ids.a, ids.b]);
        });

        it('Tree add (append)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            ids.aa = tree.add('AA', ids.a);
            ids.ab = tree.add('AB', ids.a);
            ids.ac = tree.add('AC', ids.a);

            ids.ba = tree.add('BA', ids.b);

            assert.deepEqual(tree.children(), [ids.a, ids.b]);
            assert.deepEqual(tree.children(ids.a), [ids.aa, ids.ab, ids.ac]);
            assert.deepEqual(tree.children(ids.b), [ids.ba]);
        });

        it('Tree add (prepend)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A', Tree.ROOT_ID, Tree.MODE.PREPEND);
            ids.b = tree.add('B', Tree.ROOT_ID, Tree.MODE.PREPEND);

            ids.aa = tree.add('AA', ids.a, Tree.MODE.PREPEND);
            ids.ab = tree.add('AB', ids.a, Tree.MODE.PREPEND);
            ids.ac = tree.add('AC', ids.a, Tree.MODE.PREPEND);

            assert.deepEqual(tree.children(), [ids.b, ids.a]);
            assert.deepEqual(tree.children(ids.a), [ids.ac, ids.ab, ids.aa]);
        });

        it('Tree add (after)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A', Tree.ROOT_ID, Tree.MODE.PREPEND);
            ids.b = tree.add('B', ids.a, Tree.MODE.AFTER);
            ids.c = tree.add('C', ids.a, Tree.MODE.AFTER);

            assert.deepEqual(tree.children(), [ids.a, ids.c, ids.b]);
        });

        it('Tree add (before)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A', Tree.ROOT_ID);
            ids.b = tree.add('B', ids.a, Tree.MODE.BEFORE);
            ids.c = tree.add('C', ids.a, Tree.MODE.BEFORE);

            assert.deepEqual(tree.children(), [ids.b, ids.c, ids.a]);
        });

        it('Tree item', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            assert.strictEqual('A', tree.item(ids.a));
            assert.strictEqual('B', tree.item(ids.b));
        });

        it('Tree state (get)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');

            assert.strictEqual(tree.state(ids.a), Tree.STATES.DISABLED);
        });

        it('Tree state (set)', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');

            tree.state(ids.a, 1);
            assert.strictEqual(tree.state(ids.a), Tree.STATES.ENABLED);

            tree.state(ids.a, 0);
            assert.strictEqual(tree.state(ids.a), Tree.STATES.DISABLED);

            tree.state(ids.a, Tree.STATES.ENABLED);
            assert.strictEqual(tree.state(ids.a), Tree.STATES.ENABLED);

            tree.state(ids.a, Tree.STATES.DISABLED);
            assert.strictEqual(tree.state(ids.a), Tree.STATES.DISABLED);

            tree.state(ids.a, 2);
            assert.strictEqual(tree.state(ids.a), Tree.STATES.DISABLED);
        });

        it('Tree parent', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            ids.aa = tree.add('AA', ids.a);
            ids.aaa = tree.add('AAA', ids.aa);

            ids.bb = tree.add('BB', ids.b);
            ids.bbb = tree.add('BBB', ids.bb);

            assert.strictEqual('A', tree.item(ids.a));
            assert.strictEqual('AA', tree.item(ids.aa));
            assert.strictEqual('AAA', tree.item(ids.aaa));
            assert.strictEqual('B', tree.item(ids.b));
            assert.strictEqual('BB', tree.item(ids.bb));
            assert.strictEqual('BBB', tree.item(ids.bbb));

            assert.strictEqual(tree.parent(ids.aaa), ids.aa);
            assert.strictEqual(tree.parent(ids.aa), ids.a);
            
            assert.strictEqual(tree.parent(ids.bbb), ids.bb);
            assert.strictEqual(tree.parent(ids.bb), ids.b);
            
            assert.strictEqual(tree.parent(ids.a), Tree.ROOT_ID);
            assert.strictEqual(tree.parent(ids.b), Tree.ROOT_ID);
        });

        it('Tree update', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            tree.update(ids.a, 'A"');
            assert.strictEqual(tree.item(ids.a), 'A"');
            assert.strictEqual(tree.item(ids.b), 'B');

            tree.update(ids.b, 'B"');
            assert.strictEqual(tree.item(ids.a), 'A"');
            assert.strictEqual(tree.item(ids.b), 'B"');
        });

        it('Tree stringify / parse', function(){
            var ids = {};
            var tree = new Tree;

            ids.a = tree.add('A');
            ids.b = tree.add('B');

            ids.aa = tree.add('AA', ids.a);
            ids.ab = tree.add('AB', ids.a);
            ids.ac = tree.add('AC', ids.a);

            ids.ba = tree.add('BA', ids.b);

            var str = tree.stringify();

            tree = new Tree({
                src : str
            });

            assert.deepEqual(tree.children(), [ids.a, ids.b]);
            assert.deepEqual(tree.children(ids.a), [ids.aa, ids.ab, ids.ac]);
            assert.deepEqual(tree.children(ids.b), [ids.ba]);

        });

    });
});