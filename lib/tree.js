'use strict';
define(['base', 'evt'], function(Base, Evt){
    var Tree = Base.create('tree', Base.Light, {
        initializer : function(cfg){
            this.ste = {};
            this.obs = {};
            this.uix = Tree.ROOT_ID;
            this.ixs = [Tree.ROOT_ID, Tree.ROOT_ID];

            this.obs[Tree.ROOT_ID] = 'Root';
            this.ste[Tree.ROOT_ID] = Tree.STATES.ENABLED;

            if (cfg) {
                if (cfg.src){
                    this.parse(cfg.src);
                }
                else if (cfg.load) {
                    (function(){
                        var sd;

                        this.load = cfg.load;
                        sd = localStorage.getItem(this.load);

                        if (sd) {
                            this.parse(sd);
                        }
                    }).call(this);
                }
            }
        },

        /**
         *
         * @param ob
         * @param {Number?} sp - starting point;
         * @param {Number?} mode; 0 - default - append; 1 - after; -1 - prepend;
         * @returns {number|*}
         */
        add : function(ob, sp, mode){
            var uid, six;

            mode = mode || Tree.MODE.APPEND;
            sp = sp || Tree.ROOT_ID;

            uid = ++this.uix;

            this.obs[uid] = ob;

            switch (mode) {
                case Tree.MODE.AFTER:
                    six = this.ixs.lastIndexOf(sp) + 1;
                    break;
                case Tree.MODE.BEFORE:
                    six = this.ixs.indexOf(sp);
                    break;
                case Tree.MODE.PREPEND:
                    six = this.ixs.indexOf(sp) + 1;
                    break;
                case Tree.MODE.APPEND:
                    six = this.ixs.lastIndexOf(sp);
                    break;
            }

            this.ixs.splice(six, 0, uid);
            this.ixs.splice(six, 0, uid);

            this.fire('add', {
                uid   : uid,
                obj   : ob,
                start : sp,
                mode  : mode
            });

            return uid;
        },

        stringify : function(){
            return JSON.stringify({
                i : this.ixs,
                o : this.obs,
                s : this.ste
            })
        },

        parse : function(src){
            var p;

            p = JSON.parse(src);

            this.ixs = p.i;
            this.obs = p.o;
            this.ste = p.s;
            this.uix = Math.max.apply(null, this.ixs);

            return this;
        },

        remove : function(uid){
            var lx, rx, rxc, obc;

            lx = this.ixs.indexOf(uid);
            rx = this.ixs.lastIndexOf(uid);

            if (~lx && ~rx){
                rxc = rx + 1;

                while ((rxc = rxc - 2) >= lx) {
                    delete this.obs[this.ixs[rxc]];
                    delete this.ste[this.ixs[rxc]];
                }

                this.ixs.splice(lx, rx - lx + 1);

                this.fire('remove', {
                    uid : uid
                });
            }

            return [lx, rx];
        },

        children : function(pid){
            var lx, rx, chn;

            chn = [];
            pid = pid || 0;
            lx = this.ixs.indexOf(pid);
            rx = this.ixs.lastIndexOf(pid);

            //debugger;

            while (++lx < rx) {
                chn.push(this.ixs[lx]);
                lx = this.ixs[lx] === this.ixs[lx + 1] ? lx + 1 : this.ixs.indexOf(this.ixs[lx], lx + 1);
            }

            return chn;
        },


        /**
         *
         * @param uid
         * @param state
         * @returns Number
         */
        state : function(uid, state){
            if (typeof state !== 'undefined'){
                this.ste[uid] = state === Tree.STATES.ENABLED ? Tree.STATES.ENABLED : Tree.STATES.DISABLED;
            }

            //todo: state event

            return this.ste[uid] || Tree.STATES.DISABLED;
        },

        parent : function(uid){
            var pid, lx, rx, prx;

            lx = this.ixs.indexOf(uid);
            rx = this.ixs.lastIndexOf(uid);

            do {
                lx--;
                prx = this.ixs.lastIndexOf(this.ixs[lx]);
            } while (lx > 0 && prx < rx);

            return this.ixs[prx];
        },

        update : function(uid, obj){
            var prev, lx;

            lx = this.ixs.indexOf(uid);

            if (~lx){
                prev = this.obs[uid];

                this.obs[uid] = obj;

                this.fire('update', {
                    prevVal : prev,
                    newVal  : obj,
                    uid     : uid
                });
            }
        },

        item : function(uid){
            return this.obs[uid];
        },

        save : function(){
            if (this.load) {
                localStorage.setItem(this.load, this.stringify());
            }
        }

    }, {
        ROOT_ID : 0,
        MODE    : {
            APPEND  : 0,
            PREPEND : 1,
            AFTER   : 2,
            BEFORE  : 3
        },
        STATES  : {
            ENABLED  : 1,
            DISABLED : -1
        }
    });

    Base.mix(Tree, Evt, false, true);

    return Tree;
});

