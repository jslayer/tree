'use strict';

define([
    'base', 'widget', 'evt', 'widget-tools', 'html', 'tree'
], function(Base, Widget, Evt, WidgetTools, html, Tree){
    return Base.create('tree', Widget, {
        initializer : function(cfg){
            this._tools_timer = null;

            this.tree = cfg && cfg.tree instanceof Tree ? cfg.tree : new Tree();
            this.tools = new WidgetTools({
                buttons : ['edit', 'after', 'before', 'append', 'delete'],
                text    : false
            }, 'float');

            this.toolsBase = new WidgetTools({
                buttons : this.tree.load ? ['begin', 'end', 'save'] : ['begin', 'end'],
                text    : false
            }, 'base');

            this.on('render', function(){
                this._render(0);
            });

            this.tree.on('add', function(e){
                var parent;

                parent = this.tree.parent(e.uid);
                this.tree.state(parent, Tree.STATES.ENABLED);
                this._render(parent);
            }, this);

            this.tree.on('remove', function(e){
                this._render(this.tree.parent(e.uid));

                this.tools.hide();
            }, this);

            this.tree.on('update', function(e){
                this._render(this.tree.parent(e.uid));
            }, this);

        },

        renderUI : function(){
            this._list = html({
                tag       : 'ul',
                className : 'list'
            });

            this.tools.hide().render(this.cb);
            this.toolsBase.render(this.cb);

            this.cb.appendChild(this._list);
        },

        bindUI : function(){
            this.tools.on('act', this._toolsActFn, this);
            this.toolsBase.on('act', this._toolsActFn, this);

            this.bb.addEventListener('click', (function(e){
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
                        this.tree.state(es.uid, Tree.STATES.ENABLED);
                        this._render(es.uid);
                    }
                }
            }).bind(this), false);

            this.bb.addEventListener('mouseover', (function(e){
                var es;

                es = this._getUsefulEventSource(e);

                if (es){
                    this._try2ShowTools(es);
                }
                else {
                    this._try2HideTools();
                }

                e.stopPropagation();
            }).bind(this), false);

            this.bb.addEventListener('mouseleave', this._try2HideTools.bind(this), false);
        },

        _toolsActFn : function(e){
            var obj;

            switch (e.role) {
                case 'save':
                    this.tree.save();
                    break;
                case 'begin':
                    obj = prompt('Begin');
                    if (obj){
                        this.tree.add(obj, 0, Tree.MODE.PREPEND);
                    }
                    break;
                case 'end':
                    obj = prompt('End');
                    if (obj){
                        this.tree.add(obj, 0, Tree.MODE.APPEND);
                    }
                    break;
                case 'edit':
                    obj = prompt('Edit');
                    if (obj){
                        this.tree.update(e.pos.data, obj);
                    }
                    break;
                case 'delete':
                    this.tree.remove(e.pos.data);
                    break;
                case 'before':
                    obj = prompt('Before');
                    if (obj){
                        this.tree.add(obj, e.pos.data, Tree.MODE.BEFORE);
                    }
                    break;
                case 'after':
                    obj = prompt('After');
                    if (obj){
                        this.tree.add(obj, e.pos.data, Tree.MODE.AFTER);
                    }
                    break;
                case 'append':
                    obj = prompt('Append');
                    if (obj){
                        this.tree.add(obj, e.pos.data, Tree.MODE.APPEND);
                    }
                    break;

            }
        },

        _try2ShowTools : function(es){
            clearTimeout(this._tools_timer);
            this.tools.pos(es.node, es.uid).show();
        },

        _try2HideTools : function(){
            this._tools_timer = setTimeout((function(){
                this.tools.pos(null).hide();
            }).bind(this), 250);
        },

        _getUsefulEventSource : function(e){
            var result, target, uid;

            target = e.target;

            while (target !== this.bb && target.tagName !== 'LI') {
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
            var i, l, obj, uid, children, item, sub, ul, li;

            var CN_HAS = 'has__children';

            sp = sp || Tree.ROOT_ID;

            children = this.tree.children(sp);

            ul = (sp === Tree.ROOT_ID ? this._list : this._findUl(sp, true));
            ul.innerHTML = '';

            //sync state of the current
            if (this.tree.state(sp) === Tree.STATES.ENABLED){
                ul.style.display = 'block';
            } else {
                ul.style.display = 'none';
            }

            if (children.length > 0){
                !ul.parentNode.classList.contains(CN_HAS) && ul.parentNode.classList.add(CN_HAS);
            }
            else {
                ul.parentNode.classList.remove(CN_HAS);
            }

            for (i = 0, l = children.length; i < l; i++) {
                uid = children[i];
                obj = this.tree.item(uid);

                item = {
                    tag       : 'li',
                    className : 'list_item',
                    data      : {
                        uid : uid
                    },
                    children  : [{
                        tag       : 'span',
                        className : 'item',
                        text      : obj
                    }]
                };

                sub = this.tree.children(uid);

                if (sub.length){
                    item.className += ' ' + CN_HAS;
                }

                ul.appendChild(html(item));

                if (this.tree.state(uid) === Tree.STATES.ENABLED){
                    this._render(uid);
                }
            }
        }
    });
});

