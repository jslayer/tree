'use strict';

define(['html'], function(){
    function object_copy(o){
        var i, no = {};

        for (i in o) {
            if (o.hasOwnProperty(i)){
                no[i] = o[i];
            }
        }

        return no;
    }

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
            attrs.innerHTML = attrs.text;//todo: fix potential security issue (HTML injection)
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


    return html;
});
