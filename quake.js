// var quakeLayer;
var quakeData;
var ql;

var quakeAttrib = 'Earthquake data &copy; <a href="http://earthquake.usgs.gov/">USGS</a>';

function onEachFeatureQuake(feature, layer) {
    var popupText = "Magnitude: " + feature.properties.mag
                + "<br>Location: " + feature.properties.place
                + "<br><a href='" + feature.properties.url + "'>More info</a>";
            layer.bindPopup(popupText); 
        // }
        // });
}

// quakeLayer = function() {
//     $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) { 
//         // addDataToMap(data, layer);
//     quakeData = data;
//     ql = L.geoJson(quakeData, {
//     onEachFeature: onEachFeatureQuake
// });
// });

function quakeLayer() {
    $.getJSON("http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson", function(data) { 
        // addDataToMap(data, layer);
    quakeData = data;
    ql = L.geoJson(quakeData, {
    onEachFeature: onEachFeatureQuake
});
});

}

