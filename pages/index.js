'use strict';

var resize; // called from window.parent when defined

window.addEventListener('load', function() {
    if (window.top.tutorial.contentWindow === window) { // are we on main pager tab?
        registerTab();
        window.addEventListener('scroll', setScrollWarning);
        setScrollWarning();
        enlivenClickables();
        resize = setScrollWarning;
    }

    window.top.fin.polyfills(window);
    window.top.fin.enhance(document);


    ///////////////////////

    function registerTab() {
        parent.dispatchEvent(new CustomEvent('curvy-tabs-pager-register'));
    }

    function setScrollWarning() {
        var i = window.scrollY + window.innerHeight - document.body.scrollHeight;
        var opacity = i < -100 ? 1 : i > 0 ? 0 : -i / 100;
        var el = window.top.document.getElementById('scroll-warning');
        el.style.display = opacity ? 'block' : 'none';
        el.style.opacity = opacity;
    }

    function enlivenClickables() {
        window.addEventListener('click', function(e) {
            var classList = e.target.classList;
            if (classList.contains('clickable')) {
                var tutorial = window.top.tutorial;
                if (classList.contains('page-prev')) {
                    tutorial.page(tutorial.num - 1, '');
                } else if (classList.contains('page-next')) {
                    tutorial.page(tutorial.num + 1, '');
                }
                e.stopPropagation();
            }
        });
    }
});
