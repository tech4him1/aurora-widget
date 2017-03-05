(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle("resize", "optimizedResize");
})();

/* Keep window width and height equal. */
window.addEventListener('optimizedResize', (e) => {
  const width = e.currentTarget.outerWidth;
  const height = e.currentTarget.outerHeight;
  if (height != width) {
    window.resizeTo(width, width);
  }
});
