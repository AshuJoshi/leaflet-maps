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