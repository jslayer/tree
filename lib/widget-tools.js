'use strict';

define(['base', 'widget', 'evt', 'html'], function(Base, Widget, Evt, html){
    /**
     * @constructor
     * @extends {Widget}
     */
    return Base.create('tools', Widget, {
        initializer : function(cfg){
            this._pos = null;
            this.text = typeof cfg.text !== 'undefined' ? cfg.text : true;
            this.buttons = cfg.buttons || [];
        },

        pos : function(node, data){
            var bp;

            if (node){
                if (!this._pos || this.pos.node !== node){
                    this._pos = {
                        node : node,
                        data : data
                    };
                    bp = node.getBoundingClientRect();

                    this.bb.style.top = bp.top + 'px';
                    this.bb.style.right = bp.right - node.clientWidth + 'px';
                }
            }
            else {
                this._pos = null;
            }
            return this;
        },

        renderUI : function(){
            var bts, i, l;

            bts = [];

            for (i = 0, l = this.buttons.length; i < l; i++) {
                bts.push({
                    tag       : 'button',
                    text      : this.text ? this.buttons[i] : null,
                    title     : this.buttons[i],
                    className : ['btn', this.buttons[i]].join('_'),
                    data      : {
                        role : this.buttons[i]
                    }
                });
            }

            this._list = html({
                tag       : 'div',
                className : 'wrapper',
                children  : bts
            });

            this.cb.appendChild(this._list);
        },

        bindUI : function(){
            this.bb.addEventListener('click', (function(e){
                var role;

                role = e.target.getAttribute('data-role');

                if (role && this.buttons.indexOf(role) > -1){
                    this.fire('act', {
                        role : role,
                        pos  : this._pos
                    });
                }
            }).bind(this), false);

            this.bb.addEventListener('mouseover', function(e){
                e.stopPropagation()
            }, true);
            this.bb.addEventListener('mouseout', function(e){
                e.stopPropagation()
            }, true);
        }
    });
});
