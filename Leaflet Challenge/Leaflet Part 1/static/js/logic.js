// set the variable to hold the URL
var dataURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// set the variable for the layer group
var earthquakes = L.layerGroup();

// set the variable to get the grayscale tile layer
var grayscale = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

// create a map with grayscale and layer
var myMap = L.map("map", {
    center: [38.8026, -116.4194],
    zoom: 4,
    layers: [grayscale, earthquakes]
});

d3.json(dataURL).then(function(data) {
    // console.log(data.features);

    var geometry = data.features.geometry;
    // console.log(geometry);

    function choosecolor(depth) {
        var depth = feature.geometry.coordinates[2];
        // console.log(depth);
        if (depth > 90) {
            return '#FF0D0D';
        } 
        if (depth > 70) {
            return '#FF4E11';
        }
        if (depth > 50) {
            return '#FF8E15';
        }
        if (depth > 30) {
            return '#FAB733';
        } 
        if (depth > 10) {
            return '#ACB334';
        }
        else {
            return '#69B34C'
        }
    }

    for (var i = 0; i < data.features.length; i++)
    {
        var geometry = data.features[i].geometry;
        
        var myRadius = data.features[i].properties.mag * 30000;

        var feature = data.features[i];
        // console.log(myRadius);

        var circle = L.circle([geometry.coordinates[1], geometry.coordinates[0]],{
            color: '#4C4E52',
            fillColor: choosecolor(feature.geometry.coordinates[2]), 
            radius: myRadius,
            weight: 1,
            // color: 'dark gray',
            fillOpacity: 0.5
        }).bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p>Date: ${new Date(feature.properties.time)}</p><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`).addTo(myMap);
    } 
    
});

// Here we create a legend control object.
var legend = L.control(
    {position: "bottomright"}
);

// Then add all the details for the legend
legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    // legend discription
    var grades = [-10, 10, 30, 50, 70, 90];
    let colors = [
        '#69B34C',
        '#ACB334',
        '#FAB733',
        '#FF8E15',
        '#FF4E11',
        '#FF0D0D'
    ];

    // Looping through our intervals to generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) 
    {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;

};

legend.addTo(myMap);