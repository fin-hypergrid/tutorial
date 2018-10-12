'use strict';

window.addEventListener('load', function() {
    if (registerTab()) {
        injectSVGs();

        window.addEventListener('scroll', setScrollWarning);
        setScrollWarning();

        enlivenClickables();
        enlivenTabSpans();
        setTitleAttribs();
    }

    function registerTab() {
        if (!window.top.tabBar) {
            return;
        }

        parent.dispatchEvent(new CustomEvent('curvy-tabs-pager-register', { detail: { window: window } }));
        return true;
    }

    function injectSVGs() {
        // inject <svg>...</svg> element so it can be colored by setting its fill-color (unlike <img src="reset.svg">)
        if (typeof getSmart === 'function') {
            getSmart('../img/reset.svg', function(svg) {
                forEachElement(document.getElementsByClassName('reset-button'), function (el) {
                    el.setAttribute('title', 'Reset');
                    injectSVG(el, svg)
                });
            });
        }
    }

    function injectSVG(el, svg) {
        var svgElement = /<svg[^]*<\/svg>/;
        var match = svg.match(svgElement);
        if (match) {
            el.innerHTML = match[0];
        } else {
            console.warn('No <svg> markup found.');
        }
    }

    function setScrollWarning() {
        var i = window.scrollY + window.innerHeight - document.body.scrollHeight;
        window.top.document.getElementById('scroll-warning').style.opacity = i < -100 ? 1 : i > 0 ? 0 : -i / 100;
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

    function enlivenTabSpans() {
        forEachElement(document.querySelectorAll('.tab'), function(el) {
            el.onclick = goToTab;
            el.style.backgroundColor = findTab.call(el).content.style.backgroundColor;
            el.title = 'Shortcut: Click here to select the ' + el.innerText + ' tab.';

            if (el.tagName === 'H4') {
                el.nextElementSibling.style.backgroundColor = el.style.backgroundColor;
            }
        });
    }

    function goToTab() {
        var tab = findTab.call(this),
            tabFoundAndVisible = tab.content && window.getComputedStyle(tab.content).display !== 'none';

        if (tabFoundAndVisible) {
            tab.bar.selected = tab.content;
        }
    }

    function findTab() {
        var result = {};
        [window.top.tabBar, window.top.tutorial.tabBar].find(function(tabBar) {
            var content;
            try {
                content = tabBar.getTab(this.innerText);
            } catch (e) {
                // tab not found on this tab bar
            }
            if (content) {
                result.bar = tabBar;
                result.content = content;
            }
            return content;
        }, this);
        if (!result.bar) {
            throw new ReferenceError('No such tab "' + this.innerText + '" on either tab bar!');
        }
        return result;
    }

    function setTitleAttribs() {
        forEachElement(document.querySelectorAll('a[target=doc]'), function (el) {
            el.title = 'Click to open the API documentation for "' + el.innerText + '" in another window.';
        });
        forEachElement(document.querySelectorAll('a[target=mdn]'), function (el) {
            el.title = 'Click to open the Mozilla Developer Network page for "' + el.innerText + '" in another window.';
        });
    }

    function forEachElement(elements, iterator, context) {
        Array.prototype.forEach.call(elements, iterator, context);
    }
});