// Initialize the map
const map = L.map('map').setView([45.5017, -73.5673], 11); // Centered on Montreal

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load and add GeoJSON
fetch('hextemp.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: {
        color: '#3388ff',
        weight: 2
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
