var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var Stamen_Watercolor = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'png'
});

var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	subdomains: 'abcd',
	minZoom: 0,
	maxZoom: 20,
	ext: 'png'
});

// popdns - layer to show Population Density
var popdns = new L.layerGroup();
// rnweng - layer to show Renewable Energy Goals
var rnweng = new L.layerGroup();

var map = L.map('map', {
    center: [37.8, -96],
    zoom: 4,
    layers: [OpenStreetMap_BlackAndWhite]
});

var baseLayers = {
    "OSM B&W" : OpenStreetMap_BlackAndWhite,
    "Stamen Toner" : Stamen_Toner,
    "Stamen Watercolor" : Stamen_Watercolor
    
};

var overlays = {
    "Population Density": popdns,
    "State Renewable" : rnweng
};

var options = {
    "position" : 'topright',
    "collapsed" : false,
    "autoZIndex" : true
};
L.control.layers(baseLayers, overlays, options).addTo(map);

// ----------------------- Pop Density Code ------------------------------  

var geojson;
var infoPopDensity = L.control({position: 'bottomleft'});
var legendPopDensity = L.control({position: 'bottomright'});
var censusAttrib = 'Population data &copy; <a href="http://census.gov/">US Census Bureau</a>';

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    infoPopDensity.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}); 
//}).addTo(popdns); 
//}).addTo(map);

//infoPopDensity.onAdd = function (popdns) {
infoPopDensity.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

infoPopDensity.update = function (props) {
    this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a state');
};

// get color depending on population density value
function getColor(d) {
    return d > 1000 ? '#800026' :
            d > 500  ? '#BD0026' :
            d > 200  ? '#E31A1C' :
            d > 100  ? '#FC4E2A' :
            d > 50   ? '#FD8D3C' :
            d > 20   ? '#FEB24C' :
            d > 10   ? '#FED976' :
                        '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    infoPopDensity.update(layer.feature.properties);
}

legendPopDensity.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

// ----------------------- State Renewable ------------------------------

var geojsonRnwEng;
var infoRnwEng = L.control({position: 'bottomleft'});
var legendRnwEng = L.control({position: 'bottomright'});
var rnwengAttrib = 'Energy Policy Data &copy; <a href="http://www.ncsl.org/research/energy/renewable-portfolio-standards.aspx">State Renewable Standards & Goals</a>';

function resetHighlightRnwEng(e) {
    geojsonRnwEng.resetStyle(e.target);
    infoRnwEng.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeatureRnwEng(feature, layer) {
    layer.on({
        mouseover: highlightFeatureRnwEng,
        mouseout: resetHighlightRnwEng,
        click: zoomToFeature
    });
}

geojsonRnwEng = L.geoJson(statesData, {
    style: styleRnwEng,
    onEachFeature: onEachFeatureRnwEng
}); 
//}).addTo(popdns); 
//}).addTo(map);

infoRnwEng.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};

infoRnwEng.update = function (props) {
    this._div.innerHTML = '<h4>Renewable Energy Goals</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.policy + '</b><br />' + props.goals
        : 'Hover over a state');
};

// function getColorRnwEng(d) {
//     return d == 3 ? '#FFFFFF' :
//            d == 2 ? '#bdbdbd' :
//            d == 1 ? '#636363' :
//                     '#FFEDA0';
// }

function getColorRnwEng(d) {
    return d == 3 ? '#FED976' :
           d == 2 ? '#FC4E2A' :
           d == 1 ? '#800026' :
                    '#FFEDA0';
}

function styleRnwEng(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorRnwEng(feature.properties.category)
    };
}

function highlightFeatureRnwEng(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    infoRnwEng.update(layer.feature.properties);
}

legendRnwEng.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [1, 2, 3],
        labels = [],
        lbls = ['Requirement', 'Optional', 'None'];
        

    for (var i = 0; i < grades.length; i++) {
        
        labels.push(
            '<i style="background:' + getColorRnwEng(i+1) + '"></i> ' +
            lbls[i]);
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

// ----------------------- Map Control Event Handling ------------------------------


map.on('overlayadd', function (eventLayer) {
    // Switch to the Population legendPopDensity...
    switch(eventLayer.name) {
        case 'Population Density':
            console.log("Overlay Add, Pop DNS");
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
        default:
            break;
    }

});



