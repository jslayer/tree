var TreeWidget = Base.create('tree', Widget, {
    initializer : function(cfg){
        this.tree = cfg && cfg.tree instanceof Tree ? cfg.tree : new Tree();
        this.tools = new TreeWidgetTools({
            buttons : ['above', 'below', 'delete']
        });

        this.on('render', function(){
            this._render(0);
        })
    },

    renderUI : function(){
        this._list = html({
            tag       : 'ul',
            className : 'list'
        });

        this._bb.appendChild(this._list);
        this.tools.render(this._bb);
    },

    bindUI : function(){
        this.tools.on('delete', function(){
            console.log(this);
        });

        this._bb.addEventListener('click', (function(e){
            var es, is_visible, ul;

            es = this._getUsefulEventSource(e);

            if (es){
                ul = this._findUl(es.uid, false);

                if (ul){
                    is_visible = ul.style.display !== 'none';
                    ul.style.display = is_visible ? 'none' : 'block';
                    this.tree.state(es.uid, is_visible);
                }
                else {
                    this._render(es.uid);
                }
            }
        }).bind(this), false);

        this._bb.addEventListener('mouseover', (function(e){
            var es;

            es = this._getUsefulEventSource(e);

            console.log(e);


        }).bind(this), false);

        this._bb.addEventListener('mouseleave', (function(e){

        }).bind(this), false);
    },

    _getUsefulEventSource : function(e){
        var result, target, uid;

        target = e.target;

        while (target !== this._bb && target.tagName !== 'LI') {
            target = target.parentNode;
        }

        uid = target.getAttribute('data-uid');

        if (uid !== null){
            result = {
                node : target,
                uid  : parseInt(uid, 10)
            };
        }

        return result;
    },

    _findUl : function(uid, create){
        var li, ul, l, chd;

        li = this._list.querySelector('[data-uid="' + uid + '"]');

        chd = Array.prototype.slice.call(li.childNodes);

        l = chd.length;

        while (--l >= 0) {
            if (chd[l].tagName === 'UL'){
                ul = chd[l];
                break;
            }
        }

        if (!ul && create){
            ul = html({
                tag : 'ul'
            });
            li.appendChild(ul);
        }

        return ul ? ul : false;
    },

    _render : function(sp){
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
                item.className += ' has__children';
            }

            (sp === Tree.ROOT_ID ? this._list : this._findUl(sp, true)).appendChild(html(item));

            if (this.tree.state(uid) === Tree.STATES.ENABLED){
                this._render(uid);
            }
        }
    }
});

/**
 * @constructor
 * @extends {Widget}
 */
var TreeWidgetTools = Base.create('tree_tools', Widget, {
    initializer : function(cfg){
        this.pos = null;
        this.buttons = cfg.buttons || [];

        this.after('render', function(){
            this.show();
        })
    },

    pos : function(over){
        if (this.pos !== over) {

        }
    },

    renderUI : function(){
        var bts, i, l;

            bts = [];

            for(i = 0, l = this.buttons.length; i < l; i++) {
                bts.push({
                    tag : 'button',
                    text : this.buttons[i],
                    className : ['btn', this.buttons[i]].join('_'),
                    data : {
                        role : this.buttons[i]
                    }
                });
            }

        this._list = html({
            tag       : 'ul',
            className : 'wrapper',
            children  : bts
        });

        this.hide();
        this._bb.style.position = 'absolute';

        this._bb.appendChild(this._list);
    },

    bindUI : function(){
        this._bb.addEventListener('click', (function(e){
            var role;

            role = e.target.getAttribute('data-role');

            if (role && this.buttons.indexOf(role) > -1) {
                this.fire(role, {
                    pos: this.pos
                });
            }
        }).bind(this), false);
    }
});
