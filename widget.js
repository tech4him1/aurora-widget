const throttle = require('throttleit');
const win = nw.Window.get();
/* Keep window width and height equal. */
win.on('resize', throttle((width, height)=>{
  if (width !== height) {
    win.width = height;
  }
}, 150));
