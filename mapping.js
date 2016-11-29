var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});

var Stamen_Toner = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

var OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	maxZoom: 17,
	attribution: 'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// popdns - layer to show Population Density
var popdns = new L.layerGroup();
// rnweng - layer to show Renewable Energy Goals
var rnweng = new L.layerGroup();
// quake - layer to show quakes
var quake = new L.layerGroup();

var map = L.map('map', {
    center: [37.8, -96],
    zoom: 4,
    layers: [OpenStreetMap_BlackAndWhite]
});

var baseLayers = {
    "OSM B&W" : OpenStreetMap_BlackAndWhite,
    "Stamen Toner" : Stamen_Toner,
    "Stamen Watercolor" : Stamen_Watercolor,
    "Terrain Tiles" : OpenTopoMap
    
};

var overlays = {
    "Population Density": popdns,
    "State Renewable" : rnweng,
    "Earthquakes" : quake
};

var options = {
    "position" : 'topright',
    "collapsed" : false,
    "autoZIndex" : true
};
L.control.layers(baseLayers, overlays, options).addTo(map);


// ----------------------- Map Control Event Handling ------------------------------


map.on('overlayadd', function (eventLayer) {
    // Switch to the Population legendPopDensity...
    switch(eventLayer.name) {
        case 'Population Density':
            infoPopDensity.addTo(this);
            legendPopDensity.addTo(this);
            geojson.addTo(this);
            map.attributionControl.addAttribution(censusAttrib);
            break;
        case 'State Renewable':
            infoRnwEng.addTo(this);
            geojsonRnwEng.addTo(this);
            legendRnwEng.addTo(this);
            map.attributionControl.addAttribution(rnwengAttrib);
            break;
        case 'Earthquakes':
            // ql is a GeoJSON layer created during page load...
            ql.addTo(this);
            map.attributionControl.addAttribution(quakeAttrib);
            break;
        default:
            break;
    }
});

map.on('overlayremove', function (eventLayer) {
    // Switch to the Population legendPopDensity...
    switch(eventLayer.name) {
        case 'Population Density':
            this.removeControl(infoPopDensity);
            this.removeControl(legendPopDensity);
            this.removeControl(geojson);
            map.attributionControl.removeAttribution(censusAttrib);
            break;
        case 'State Renewable':
            this.removeControl(infoRnwEng);
            this.removeControl(geojsonRnwEng);
            this.removeControl(legendRnwEng);
            map.attributionControl.removeAttribution(rnwengAttrib);
            break;
        case 'Earthquakes':
            this.removeControl(ql);
            map.attributionControl.removeAttribution(quakeAttrib);
            break;
        default:
            break;
    }

});



