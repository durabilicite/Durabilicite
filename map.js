// Initialize the map
const map = L.map('map').setView([45.5017, -73.5673], 11);

// Add a base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Load and style the GeoJSON
fetch('hextemp.geojson')
    .then(response => response.json())
    .then(data => {
      // Extract and convert all values
      const values = data.features
          .map(f => Number(f.properties.mean_temp_class))
          .filter(v => !isNaN(v));  // remove nulls/undefined

      const minTemp = Math.min(...values);
      const maxTemp = Math.max(...values);
      const midTemp = (minTemp + maxTemp) / 2;

      console.log({ minTemp, midTemp, maxTemp }); // Debug

      // Diverging color scale
      function getColor(tempClass) {
        const value = Number(tempClass);
        if (isNaN(value)) return '#ccc'; // fallback color for missing data

        return chroma
            .scale(['blue', 'white', 'red'])
            .domain([minTemp, midTemp, maxTemp])
            .mode('lab')(value)
            .hex();
      }

      L.geoJSON(data, {
        style: function(feature) {
          const tempVal = feature.properties.mean_temp_class;
          return {
            fillColor: getColor(tempVal),
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
