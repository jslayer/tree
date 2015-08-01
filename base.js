var Base = {
    /**
     * @param {Function} T - target constructor
     * @param {Function} S - source constructor
     * @param {Boolean} override - default: false
     * @param {Boolean} mixed - default: false
     */
    mix : function mix(T, S, override, mixed){
        var i;

        override = !!override;

        for (i in S) {
            if (S.hasOwnProperty(i)){
                if (override || !T.hasOwnProperty(i)){
                    T[i] = S[i];
                }
            }
        }

        for (i in S.prototype) {
            if (S.prototype.hasOwnProperty(i)){
                if (override || !T.prototype.hasOwnProperty(i)){
                    T.prototype[i] = S.prototype[i];
                }
            }
        }

        if (mixed && typeof S.prototype.initializer === 'function') {
            if (!T.__mixed__) {
                T.__mixed__ = [];
            }

            T.__mixed__.push(S.prototype.initializer);
        }
    },

    /**
     * @param {String} name
     * @param {Function} P - base constructor
     * @param {Object?} px - prototype
     * @param {Object?} sx - static
     * @returns {Function}
     */
    create : function create(name, P, px, sx){
        var C, F, i;

        F = function(){
        };

        if (px && px.hasOwnProperty('constructor')){
            C = px.constructor;
        }
        else {
            C = function(){
                P.apply(this, arguments);
            };
        }

        if (typeof px.initializer !== 'function') {
            px.initializer = null;
        }

        F.prototype = P.prototype;
        C.prototype = new F();

        for (i in sx) {
            if (sx.hasOwnProperty(i)){
                C[i] = sx[i];
            }
        }

        for (i in px) {
            if (px.hasOwnProperty(i)){
                C.prototype[i] = px[i];
            }
        }

        C.__super__ = P.prototype;
        C.prototype.constructor = C;
        C.prototype.name = name;

        return C;
    },

    /**
     * @constructor
     */
    Light : function Light(){
        var _init = [],
            _ii,
            i, l,
            pt = this;

        while (pt) {
            _ii = [null, null];
            if (typeof pt.initializer === 'function'){
                _ii[0] = pt.initializer;
            }

            if (pt.constructor.__mixed__) {
                _ii[1] = pt.constructor.__mixed__;
            }

            _init.push(_ii);
            pt = pt.constructor.__super__;
        }

        while(pt = _init.pop()) {
            if (pt[1]) {
                for(i = 0, l = pt[1].length; i < l; i++) {
                    pt[1][i].apply(this, arguments);
                }
            }
            if (pt[0]) {
                pt[0].apply(this, arguments);
            }
        }
    }
};

function Evt(){}

Evt.TYPES = ['before', 'on', 'after'];

Evt.prototype.initializer = function(){
    var i, l, ts;

    this._evt = {};

    ts = Evt.TYPES;

    for(i = 0, l = ts.length; i < l; i++) {
        this._evt[ts[i]] = [];
    }

};

/**
 * @param {String} type
 * @param args
 * @returns {{name: *, cb: *, context: *, args: *}|*}
 * @private
 */
Evt.prototype._listen = function(type, args){
    var lnr;

    lnr = {
        name : args[0], cb : args[1], context : args[2], args : args[3]
    };

    this._evt[type].push(lnr);
    return lnr;
};

Evt.prototype.on = function(name, cb, context, args){
    return this._listen.apply(this, ['on', arguments]);
};

Evt.prototype.after = function(name, cb, context, args){
    return this._listen.apply(this, ['after', arguments]);
};

Evt.prototype.before = function(name, cb, context, args){
    return this._listen.apply(this, ['before', arguments]);
};

/**
 * @param {String} name
 * @param {Object*} cfg - additional data
 * @returns {Evt}
 */
Evt.prototype.fire = function(name, cfg){
    var ti, tl, i, l, ts, lnr;

    ts = Evt.TYPES;

    for(ti = 0, tl = ts.length; ti < tl; ti++) {
        for(i = 0, l = this._evt[ts[ti]].length; i < l; i++) {
            lnr = this._evt[ts[ti]][i];

            if (lnr.name === name) {
                lnr.cb.call(lnr.context || this, cfg, lnr.args);
            }
        }
    }

    return this;
};

/**
 * @augments {Evt}
 * @constructor
 */
var Widget = Base.create('widget', Base.Light, {
    initializer : function(){
        console.log('W C');

        if (!this._bb){
            this._bb = html({
                className : ['w', this.name].join('-')
            });
        }
    },

    /**
     * @param {HTMLElement?} node
     * @returns {Widget}
     */
    render : function(node){
        if (!this.rendered) {
            if (typeof this.renderUI === 'function'){
                this.renderUI();
            }
            if (typeof this.bindUI === 'function'){
                this.bindUI();
            }

            (node || document.body).appendChild(this._bb);

            this.rendered = true;
            this.fire('render');
        }

        return this;
    },

    show : function(){
        this._bb.style.display = 'block';
        return this;
    },

    hide : function(){
        this._bb.style.display = 'none';
        return this;
    }
});

Base.mix(Widget, Evt, false, true);

function html(attrs){
    var node, tag, _k, l;

    attrs = object_copy(attrs);

    tag = attrs.tag || 'div';
    node = document.createElement(tag);

    attrs.tag = null;

    if (attrs.data){
        for (_k in attrs.data) {
            if (attrs.data.hasOwnProperty(_k)){
                node.setAttribute('data-' + _k, attrs.data[_k]);
            }
        }
    }
    attrs.data = null;

    if (attrs.style){
        for (_k in attrs.style) {
            if (attrs.style.hasOwnProperty(_k)){
                node.style[_k] = attrs.style[_k];
            }
        }
    }
    attrs.data = null;

    if (attrs.children){
        for (_k = 0, l = attrs.children.length; _k < l; _k++) {
            node.appendChild(html(attrs.children[_k]));
        }
    }
    attrs.children = null;

    if (attrs.text){
        attrs.innerHTML = attrs.text;
        attrs.text = null;
    }

    for (_k in attrs) {
        if (attrs.hasOwnProperty(_k) && attrs[_k]){
            if (_k === 'innerHTML'){
                if (node.innerHTML){
                    node.innerHTML += attrs[_k];
                }
                else {
                    node.innerHTML = attrs[_k];
                }
            }
            else if (html.own[_k]){
                node[_k] = attrs[_k];
            }
            else {
                node.setAttribute(_k, attrs[_k]);
            }
        }
    }

    return node;
}

html.own = {
    innerHTML : true,
    className : true
};

function object_copy(o){
    var i, no = {};

    for (i in o) {
        if (o.hasOwnProperty(i)){
            no[i] = o[i];
        }
    }

    return no;
}
