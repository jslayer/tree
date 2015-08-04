require.config({
    baseUrl : 'lib/'
});

define(['tree', 'tree-widget'], function(Tree, TreeWidget){
    var tree1, tree2;

    tree1 = new Tree({
        load : 't1'
    });

    if (!tree1.children(0).length){
        tree1.add('Hello');
        tree1.add('World');
    }

    new TreeWidget({
        tree : tree1
    }).render(
        document.getElementById('tgt')
    );

    //without save button
    new TreeWidget({
        tree : (function(){
            var t, uid;

            t = new Tree;

            uid = t.add('Lorem');

            t.add('Ipsum', uid);
            t.add('Dolor', uid);

            return t;
        })()
    }).render(
        document.getElementById('tgt')
    );
});