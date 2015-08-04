'use strict';

define(['evt'], function(){
    function Evt(){
    }

    Evt.TYPES = ['before', 'on', 'after'];

    Evt.prototype.initializer = function(){
        var i, l, ts;

        this._evt = {};

        ts = Evt.TYPES;

        for (i = 0, l = ts.length; i < l; i++) {
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

        for (ti = 0, tl = ts.length; ti < tl; ti++) {
            for (i = 0, l = this._evt[ts[ti]].length; i < l; i++) {
                lnr = this._evt[ts[ti]][i];

                if (lnr.name === name){
                    lnr.cb.call(lnr.context || this, cfg, lnr.args);
                }
            }
        }

        return this;
    };

    return Evt;
});