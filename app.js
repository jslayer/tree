require.config({
    baseUrl : 'lib/'
});

define(['tree', 'tree-widget'], function(Tree, TreeWidget){
    new TreeWidget({
        tree : (function(){
            var t;

            t = new Tree({load : 't1'});

            if (!t.children(0).length){
                t.add('Hello');
                t.add('World');
            }
            return t;
        })()
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