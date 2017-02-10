var $ = require("jquery");

nw.Window.open('widget.html', {
  "id": "widget", // Add an ID to remember position.
  "show_in_taskbar": false,
  "frame": false,
  "width": 616,
  "height": 616,
  "max_width": 616,
  "max_height": 616,
  "min_width": 154,
  "min_height": 154,
}, (win)=>{
  loadForecast(win.window);
});

function loadForecast(widget) {
  // Make widget document object a jQuery object.
  widget = $( widget.document );
  widget.ready(()=>{

    // Add latest aurora map.  We have to use timestamp to override the browser cache.
    widget.find( "#auroraMap" ).attr("src", "http://services.swpc.noaa.gov/experimental/images/animations/auroral-forecast-north/latest.jpg?" + new Date().getTime());

    // Add latest Kp index.
    $.get('http://services.swpc.noaa.gov/products/noaa-estimated-planetary-k-index-1-minute.json').then(kpIndex => {
      // Parse the Kp Index list.  We only need the newest (last) value.
      var latestKpIndex = parseKp([[kpIndex[0], kpIndex[kpIndex.length-1]]])[0].estimated_kp;
      widget.find( "#kpIndex" )
        .css({
          "color": getKpColor(latestKpIndex),
          "animation-duration": ((10 - latestKpIndex) / 2) + "s" // Flash text when Kp index is high.
        })
        .text(latestKpIndex + " Kp");
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
