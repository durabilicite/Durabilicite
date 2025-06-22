// Initialize the map
const map = L.map('map').setView([45.5017, -73.5673], 11); // Centered on Montreal

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define color scale function
function getColor(tempClass) {
  return tempClass >= 5 ? '#800026' :
         tempClass >= 4 ? '#BD0026' :
         tempClass >= 3 ? '#E31A1C' :
         tempClass >= 2 ? '#FC4E2A' :
         tempClass >= 1 ? '#FD8D3C' :
                          '#FEB24C'; // default light color
}

// Load and add GeoJSON
fetch('hextemp.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: function(feature) {
        return {
          fillColor: getColor(feature.properties.mean_temp_class),
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
