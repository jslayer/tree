'use strict';

define(['base', 'evt', 'html'], function(Base, Evt, html){
    /**
     * @augments {Evt}
     * @constructor
     */
    var Widget = Base.create('widget', Base.Light, {
        initializer : function(cfg, name2){
            if (typeof name2 === 'string'){
                this.name2 = name2;
            }

            if (!this.bb){
                this.bb = html({
                    className : (function(){
                        var cns;

                        cns = [this._getClassName()];

                        if (this.name2) {
                            cns.push(this._getClassName(this.name2))
                        }
                        return cns.join(' ');
                    }).call(this)
                });
            }

            if (!this.cb){
                this.cb = html({
                    className : this._getClassName('cb')
                });
            }
        },

        /**
         * @param {HTMLElement?} node
         * @returns {Widget}
         */
        render : function(node){
            if (!this.rendered){
                if (typeof this.renderUI === 'function'){
                    this.renderUI();
                }
                if (typeof this.bindUI === 'function'){
                    this.bindUI();
                }

                this.bb.appendChild(this.cb);

                (node || document.body).appendChild(this.bb);

                this.rendered = true;
                this.fire('render');
            }

            return this;
        },

        show : function(){
            this.bb.style.display = 'block';
            return this;
        },

        hide : function(){
            this.bb.style.display = 'none';
            return this;
        },

        _getClassName : function(suffix){
            return 'w-' + this.name + (suffix ? '__' + suffix : '');
        }
    });

    Base.mix(Widget, Evt, false, true);

    return Widget;
});


