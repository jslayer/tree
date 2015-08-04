define(['html'], function(){
    return {
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

            if (mixed && typeof S.prototype.initializer === 'function'){
                if (!T.__mixed__){
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

            if (typeof px.initializer !== 'function'){
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

                if (pt.constructor.__mixed__){
                    _ii[1] = pt.constructor.__mixed__;
                }

                _init.push(_ii);
                pt = pt.constructor.__super__;
            }

            while (pt = _init.pop()) {
                if (pt[1]){
                    for (i = 0, l = pt[1].length; i < l; i++) {
                        pt[1][i].apply(this, arguments);
                    }
                }
                if (pt[0]){
                    pt[0].apply(this, arguments);
                }
            }
        }
    };
});
