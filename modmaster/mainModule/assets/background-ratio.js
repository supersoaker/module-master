
(function(w, d) {
    /**
     * document ready function
     * @param f - callback function
     */
    function r(f){/in/.test(d.readyState)?setTimeout(r,9,f):f()}
    /**
     * resize html-element height in ratio of background image
     * @usage <div data-ratio="1920x1080"></div>
     */
    r(function() {
        /**
         * function to add an event listener
         * @param e - element
         * @param n - event name
         * @param f - callback function
         * @param a - placeholder
         */
        var addEvent    = function(e, n, f, a) {
                return e[a='addEventListener'] && e[a]( n, f, false )
                    || e[a='attachEvent'] && e[a]( "on" + n, f )
            },
            elems       = d.querySelectorAll('[data-ratio]'),
            l           = elems.length,
            i           = 0,
            elemsArr    = [],
            onResizeFunc = function() {
                var newWidth = w.innerWidth
                    || d.documentElement.clientWidth
                    || d.body.clientWidth;
                while(i<l){
                    var elem = elemsArr[i];
                    elem.elem.style.height = newWidth/elem.width*elem.height+ 'px';
                    i++;
                }i=0;
            };
        while(i<l){
            var elem = elems[i];
            var ratio = elem.getAttribute('data-ratio').split('x');
            elemsArr.push({
                elem: elem,
                width: ratio[0],
                height: ratio[1]
            });
            i++;
        }i=0;
        addEvent(window, "resize", onResizeFunc);
        onResizeFunc();
    });
})(self, document);

