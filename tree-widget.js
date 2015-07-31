//depend: tree

function TreeWidget(tree){
    this.rendered = false;
    this.tree = tree instanceof Tree ? tree : new Tree();
}

TreeWidget.prototype.renderUI = function(){
    if (!this._bb){
        this._bb = html({
            className : 'tree'
        });
    }

    if (!this._list){
        this._list = html({
            tag       : 'ul',
            className : 'list'
        });

        this._bb.appendChild(this._list);
    }

    if (!this._tools){
        this._tools = html({
            tag       : 'ul',
            className : 'tools',
            style     : {
                display  : 'none',
                position : 'absolute'
            },
            children  : [
                {
                    tag  : 'li',
                    text : 'Delete'
                }
            ]
        });

        this._tools.style.display = 'none';
        this._tools.style.position = 'absolute';

        this._bb.appendChild(this._tools);
    }
};

TreeWidget.prototype.bindUI = function(){
    this._bb.addEventListener('click', (function(e){
        var target, uid, ul, visible;

        target = e.target;


        while (target !== this._bb && target.tagName !== 'LI') {
            target = target.parentNode;
        }

        uid = target.getAttribute('data-uid');

        if (typeof uid !== 'undefined') {
            uid = parseInt(uid, 10);
            ul = this._findUl(uid, false);

            if (ul){
                visible = ul.style.display !== 'none';
                ul.style.display = visible ? 'none' : 'block';
                this.tree.state(uid, visible);
            }
            else {
                this._render(uid);
            }

            console.log(this.tree.state);
        }
    }).bind(this), false);
};

TreeWidget.prototype._findUl = function(uid, create){
    var li, ul, l, chd;

    li = this._list.querySelector('[data-uid="' + uid + '"]');

    chd = Array.prototype.slice.call(li.childNodes);

    l = chd.length;

    while(--l >=0) {
        if (chd[l].tagName === 'UL') {
            ul = chd[l];
            break;
        }
    }

    if (!ul && create) {
        ul = html({
            tag : 'ul'
        });
        li.appendChild(ul);
    }

    return ul ? ul : false;
};

Tree.prototype.item = function(uid){
    return this.obs[uid];
};

TreeWidget.prototype._render = function(sp){
    var i, l, obj, uid, children, item, sub;

    sp = sp || Tree.ROOT_ID;

    children = this.tree.children(sp);

    for (i = 0, l = children.length; i < l; i++) {
        uid = children[i];
        obj = this.tree.item(uid);

        item = {
            tag       : 'li',
            data      : {
                uid : uid
            },
            className : 'list_item',
            children  : [{
                tag       : 'span',
                className : 'item',
                text      : obj
            }]
        };

        sub = this.tree.children(uid);

        if (sub.length){
            item.children.push({
                tag  : 'small',
                text : ' (' + sub.length + ')'
            });

            item.className += ' has__children';
        }

        (sp === Tree.ROOT_ID ? this._list : this._findUl(sp, true)).appendChild(html(item));
    }

    return this;
};

TreeWidget.prototype.render = function(node){
    if (!this.rendered){
        this.renderUI();
        this.bindUI();
        this._render();

        node = node || document.body;

        node.appendChild(this._bb);

        this.rendered = true;
    }
    return this;
};