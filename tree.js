'use strict';
function Tree(src){
    this.ste = {};
    this.obs = {};
    this.uix = Tree.ROOT_ID;
    this.ixs = [Tree.ROOT_ID, Tree.ROOT_ID];

    this.obs[Tree.ROOT_ID] = 'Root';
    this.ste[Tree.ROOT_ID] = Tree.STATES.ENABLED;

    if (src) {
        this.parse(src);
    }
}

/**
 *
 * @param ob
 * @param {Number?} sp - starting point;
 * @param {Number?} mode; 0 - default - append; 1 - after; -1 - prepend;
 * @returns {number|*}
 */
Tree.prototype.add = function(ob, sp, mode){
    var uid, six;

    mode = mode || Tree.MODE.APPEND;
    sp = sp || Tree.ROOT_ID;

    uid = ++this.uix;

    this.obs[uid] = ob;

    six = this.ixs.lastIndexOf(sp) + mode;

    this.ixs.splice(six, 0, uid);
    this.ixs.splice(six, 0, uid);

    return uid;
};

Tree.ROOT_ID = 0;

Tree.MODE = {
    APPEND  : 0,
    AFTER   : 1,
    PREPEND : -1
};

Tree.prototype.stringify = function(){
    return JSON.stringify({
        ixs : this.ixs,
        obs : this.obs
    });
};

Tree.prototype.parse = function(src){
    var p;

    p = JSON.parse(src);

    this.ixs = p.ixs;
    this.obs = p.obs;

    return this;
};

Tree.prototype.remove = function(uid){
    var lx, rx, rxc, obc;

    lx = this.ixs.indexOf(uid);
    rx = this.ixs.lastIndexOf(uid);

    rxc = rx + 1;

    while((rxc = rxc-2) >= lx) {
        delete this.obs[this.ixs[rxc]];
        delete this.ste[this.ixs[rxc]];
    }

    this.ixs.splice(lx, rx - lx + 1);

    return [lx, rx];//todo: return result
};

Tree.prototype.children = function(pid){
    var lx, rx, chn;

    chn = [];
    pid = pid || 0;
    lx = this.ixs.indexOf(pid);
    rx = this.ixs.lastIndexOf(pid);

    while(++lx < rx) {
        chn.push(this.ixs[lx]);
        lx = this.ixs[lx] === this.ixs[lx + 1] ? lx + 1 : this.ixs.indexOf(this.ixs[lx], lx + 1);
    }

    return chn;
};

/**
 *
 * @param uid
 * @param state
 * @returns Number
 */
Tree.prototype.state = function(uid, state){
    if (typeof state !== 'undefined'){
        this.ste[uid] = state === Tree.STATES.ENABLED ? Tree.STATES.ENABLED : Tree.STATES.DISABLED;
    }

    return this.ste[uid] || Tree.STATES.DISABLED;
};

Tree.prototype.parent = function(uid){
    var pid, lx, rx, prx;

    lx = this.ixs.indexOf(uid);
    rx = this.ixs.lastIndexOf(uid);

    do {
        lx--;
        prx = this.ixs.lastIndexOf(this.ixs[lx]);
    } while (lx > 0 && prx < rx);

    return this.ixs[prx];
};

Tree.prototype.item = function(uid){
    return this.obs[uid];
};

Tree.STATES = {
    ENABLED : 1,
    DISABLED : 0
};

//todo: validate
//todo: remove

//var ts, uid_a, uid_a2, uid_a4, uid_b, uid_c, uid_d;
//
//ts = new Tree();
//
//uid_a = ts.add('A');
//ts.add('B');
//
//ts.add('A1', uid_a, 0);
//uid_a2 = ts.add('A2', uid_a, 0);
//ts.add('A3', uid_a, 0);
//uid_a4 = ts.add('A4', uid_a, 0);
//ts.add('A5', uid_a, 0);
//
//ts.add('A21', uid_a2, 0);
//ts.add('A22', uid_a2, 0);
//ts.add('A23', uid_a2, 0);
//ts.add('A24', uid_a2, 0);
//
//ts.add('A41', uid_a4, 0);
//ts.add('A42', uid_a4, 0);
//ts.add('A43', uid_a4, 0);
//ts.add('A44', uid_a4, 0);
//
//console.log(ts.children(uid_a2));