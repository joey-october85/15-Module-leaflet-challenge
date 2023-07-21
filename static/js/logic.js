// Creating our initial map object:
// We set the longitude, latitude, and starting zoom level.
// This gets inserted into the div with an id of "map".
let myMap = L.map("map", {
    center: [44.089, -103.82],
    zoom: 6
});




// Adding a tile layer (the background map image) to our map:
// We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// API
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
let promise = d3.json(url);
console.log(promise)

promise.then(function (data) {

    let info = data.features;

    for (let i = 0; i < info.length; i++) {
        let location = info[i].geometry.coordinates;
        let magnitude = info[i].properties.mag;
        let depth = info[i].geometry.coordinates[2];
        let title = info[i].properties.title
        let milliseconds = info[i].properties.time
        let date = new Date(milliseconds)

        let magcolor

        // console.log(milliseconds)

        if (depth > 90) {
            magcolor = "#cf0606"
        } else if (depth > 69) {
            magcolor = "#b54e04"
        } else if (depth > 49) {
            magcolor = "#fc710d"
        } else if (depth > 29) {
            magcolor = "#fcb603"
        } else if (depth > 9) {
            magcolor = "#fcf403"
        } else { magcolor = "#32a852" }


        L.circle([location[1], location[0]], {
            fillOpacity: 0.45,
            color: "black",
            weight: .5,
            fillColor: magcolor,
            radius: magnitude * 15000
        }).bindPopup(`<h4>${title} (Depth: ${depth}) <hr> ${date}</h4>`).addTo(myMap)
    }

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "info legend");
        let colors = ["#32a852", "#fcf403", "#fcb603", "#fc710d", "#b54e04", "#cf0606"]
        let labels = [-10, 10, 30, 50, 70, 90];

        for (let i = 0; i < labels.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
                + labels[i] + (labels[i + 1] ? "&ndash;" + labels[i + 1] + "<br>" : "+");
        }
        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);


});