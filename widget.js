'use strict';

function throttle(type, name, target) {
    var running = false;
    var func = function() {
        if (running) { return; }
        running = true;
        requestAnimationFrame(function() {
            target.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    target.addEventListener(type, func);
};

/* init - you can init any event */
throttle("resize", "optimizedResize", window);

/* Keep window width and height equal. */
window.addEventListener('optimizedResize', (e) => {
    const width = window.outerWidth;
    const height = window.outerHeight;
    if (height != width) {
        window.resizeTo(width, width);
    }
});
