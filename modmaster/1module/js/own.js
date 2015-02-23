
(function(w, d) {
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
})(self, document);

