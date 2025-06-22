// Initialize the map
const map = L.map('map').setView([45.5017, -73.5673], 11);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define min, mid, max values for mean_temp_class
const minTemp = 0;
const maxTemp = 5;
const midTemp = (minTemp + maxTemp) / 2;

// Diverging color scale: blue → white → red
function getColor(tempClass) {
  return chroma
      .scale(['blue', 'white', 'red'])
      .domain([minTemp, midTemp, maxTemp])
      .mode('lab')(Number(tempClass))
      .hex();
}

// Load and style the GeoJSON
fetch('hextemp.geojson')
    .then(response => response.json())
    .then(data => {
      L.geoJSON(data, {
        style: function(feature) {
          const value = feature.properties.mean_temp_class;
          return {
            fillColor: getColor(value),
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          };
        },
        onEachFeature: function (feature, layer) {
          if (feature.properties) {
            layer.bindPopup(Object.entries(feature.properties)
                .map(([key, val]) => `<strong>${key}:</strong> ${val}`)
                .join('<br>'));
          }
        }
      }).addTo(map);
    });
