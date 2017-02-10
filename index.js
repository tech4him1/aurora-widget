const $ = require("jquery");

nw.Window.open('widget.html', {
  "id": "widget", // Add an ID to remember position.
  "show_in_taskbar": false,
  "always_on_top": true,
  "frame": false,
  "show": false,
  "width": 616,
  "height": 616,
  "max_width": 616,
  "max_height": 616,
  "min_width": 154,
  "min_height": 154,
}, (win)=>{
  loadForecast(win.window);
  win.show();
  setInterval(()=>{loadForecast(win.window)}, 60*1000); // Update forecast every minute.
});

function loadForecast(widget) {
  // Make widget document object a jQuery object.
  widget = $( widget.document );
  widget.ready(()=>{

    // Add latest aurora map.  We have to use timestamp to override the browser cache.
    widget.find( "#auroraMap" ).attr("src", "http://services.swpc.noaa.gov/images/animations/ovation-north/latest.png?" + new Date().getTime());

    // Add latest Kp index.
    $.getJSON('http://services.swpc.noaa.gov/products/noaa-estimated-planetary-k-index-1-minute.json', { "timeout": 15*1000 }) // Timeout after 15 seconds since main interval in 60 seconds.
      .then(kpIndex => {
        // Parse the Kp Index list.  We only need the newest (last) value.
        var latestKpIndex = parseKp([[kpIndex[0], kpIndex[kpIndex.length-1]]])[0].estimated_kp;
        widget.find( "#kpIndex" )
          .css({
            "color": getKpColor(Math.round(latestKpIndex)),
            "animation-duration": ((10 - Math.round(latestKpIndex)) / 2) + "s" // Flash text when Kp index is high.
          })
          .text(Math.round(latestKpIndex) + " Kp");
      });

  });
}

// Parse an array of Kp indices.
function parseKp(kpIndexHist) {
  // Get the main array.
  kpIndexHist = kpIndexHist[0];
  // The first element in the array is the key (kind of like CSV headers).
  var indexKey = kpIndexHist[0];
  var parsedKpIndexHist = [];
  // Start at index 1, since 0 is the key.
  for (let i=1; i < kpIndexHist.length; i++) {
    // Create a variable for this Kp index and an empty sport to be parsed to.
    let thisKpIndex = kpIndexHist[i];
    let thisParsedKpIndex = {};
    // Loop through each value in the list and save it to the parsed object with the name from the index key.
    for (let j=0; j < thisKpIndex.length; j++) {
      thisParsedKpIndex[indexKey[j]] = thisKpIndex[j];
    }
    // Save the parsed Kp index to the list.
    parsedKpIndexHist[i-1] = thisParsedKpIndex;
  }
  return parsedKpIndexHist;
}

function getKpColor(kpIndex) {
  let hueBase = 120 / 7;
  var hue = 120 - (hueBase * kpIndex); // The highest should have an hue of 0 (red).
  var lightness = 35 + (kpIndex * 2);
  return "hsl(" + hue + ", 100%, " + lightness + "%)";
}
