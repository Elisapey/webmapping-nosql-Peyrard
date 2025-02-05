var map = new ol.Map({
 target: 'map',
 layers: [
   new ol.layer.Tile({
     source: new ol.source.OSM(),
     opacity: 1
   }),
   new ol.layer.Vector({
     source: new ol.source.Vector({
       url: 'geo-search-results-json' + window.location.search,
       format: new ol.format.GeoJSON()
     })
   })
 ],
 view: new ol.View({
   center: ol.proj.fromLonLat([2.584, 48.841]),
   zoom: 12,
   maxZoom: 20,
 })
});

