open Webapi.Dom;

{
  let throttle = (~type_, ~name, ~target) => {
    let running = ref(false);
    let func = (_) =>
      while (! running^) {
        running := true;
        Webapi.requestAnimationFrame((_) => {
          let _ = EventTarget.dispatchEvent(Event.make(name), target);
          running := false;
        });
      };
    EventTarget.addEventListener(type_, func, target);
  };
  /* init - you can init any event */
  throttle(
    ~type_="resize",
    ~name="optimizedResize",
    ~target=Window.asEventTarget(window),
  );
};

/* Keep window width and height equal. */
EventTarget.addEventListener(
  "optimizedResize",
  (_) => {
    let width = Window.outerWidth(window);
    let height = Window.outerHeight(window);
    if (height !== width) {
      Window.resizeTo(width, width, window);
    };
  },
  Window.asEventTarget(window),
);
