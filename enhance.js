'use strict';

fin.enhance = function(document) {
    enhance.queue.push(document);
};

fin.enhance.queue = [];

getSmart({
    'reset': 'img/reset.svg',
    'delete': 'img/delete.svg'
}, function(svgFiles) {
    function enhance(document) {
        setTitleAttribs(document);
        injectSVGs(document);
        enlivenTabSpans(document);
        enlivenPageLinks(document);
    }

    function setTitleAttribs() {
        document.querySelectorAll('a[target=doc]').forEach(function (el) {
            el.title = 'Click to open the API documentation for "' + el.innerText + '" in another window.';
        });
        document.querySelectorAll('a[target=mdn]').forEach(function (el) {
            el.title = 'Click to open the Mozilla Developer Network page for "' + el.innerText + '" in another window.';
        });
    }

    // Create inline <svg> elements rather than using <img> tag.
    // This allows us to set the <svg>'s fill and stroke colors with CSS.
    function injectSVGs(document) {
        Object.keys(svgFiles).forEach(function (key) {
            var className = key + '-button';
            var els = document.getElementsByClassName(className);
            els.forEach(function (el) {
                injectSVG(el, svgFiles[key]);
            });
        });
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

    function enlivenPageLinks(document) {
        document.querySelectorAll('.page').forEach(function (el) {
            var href = el.getAttribute('href');
            if (href) {
                href = decodeURI(href);
            } else {
                href = el.innerText + '.html';
            }
            el.setAttribute('href', 'javascript:void(0)');

            el.onclick = goToPage.bind(el, href);
        });
    }

    function goToPage(href) {
        window.top.tutorial.page(href);
    }

    function enlivenTabSpans(document) {
        document.querySelectorAll('.tab').forEach(function (el) {
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
            tab.bar.select(tab.content, true);
        }
    }

    function findTab() {
        var result = {};
        [window.top.tabBar, window.top.tutorial.tabBar].find(function (tabBar) {
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

    fin.enhance.queue.forEach(function(document) {
        enhance(document)
    });

    fin.enhance = enhance;
});
