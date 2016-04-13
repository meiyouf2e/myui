"use strict";

var liveOnStage = require('./live-on-stage.js'),

    ATTR = 'data-src',
    SELECTOR = 'img[' + ATTR + ']',
    LAZY_LOADED = 'lazy-loaded',
//<img data-src="../test.png"/>
    /*
        Add lazy-loaded class

        @param [DOM]: Element to show
    */
    addLoadedClass = function (element) {
        if (element.classList) {
            element.classList.add(LAZY_LOADED);
        } else {
            element.className += ' ' + LAZY_LOADED;
        }
    };

module.exports = {

    /*
        Initialise lazy load
    */
    init: function () {
        liveOnStage.track(
            SELECTOR,
            function (element) {
                var src = element.getAttribute(ATTR);
                element.removeAttribute(ATTR);
                element.addEventListener('load', function () {
                    addLoadedClass(element);
                });

                if (element.complete) {
                    addLoadedClass(element);
                }

                element.setAttribute('src', src);

                return true;
            }
        );
    },

    /*
        Refresh selection
    */
    refresh: function () {
        liveOnStage.refresh(SELECTOR);
    }
};
