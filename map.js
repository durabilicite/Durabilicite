// Initialize the map
const map = L.map('map').setView([45.5017, -73.5673], 11);

// Add a base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Define color scales for each field (you can add more here)
const colorScales = {
    mean_temp_class: chroma.scale(['blue', 'white', 'red']).domain([0, 2.5, 5]).mode('lab'),
    weighted_population: chroma.scale(['white', 'purple']).domain([0, 2000]).mode('lab')
};

// Optional: map filenames to the field you want to color by
const datasetFields = {
    'hextemp.geojson': 'mean_temp_class',
    'hexpop.geojson': 'weighted_population'
};

// Function to get color for a value from the correct color scale
function getColor(value, field) {
    const scale = colorScales[field];
    if (!scale) return '#ccc'; // fallback color
    return scale(Number(value)).hex();
}

// Keep track of the current layer so we can remove it later
let currentLayer = null;

// Load and display a GeoJSON file
function loadGeoJSON(file) {
    fetch(file)
        .then(response => response.json())
        .then(data => {
            // Remove any existing layer
            if (currentLayer) {
                map.removeLayer(currentLayer);
            }

            // Determine which field to color by
            const field = datasetFields[file] || Object.keys(data.features[0].properties).find(k => k in colorScales);

            // Create new layer
            currentLayer = L.geoJSON(data, {
                style: function(feature) {
                    const value = feature.properties[field];
                    return {
                        fillColor: getColor(value, field),
                        weight: 1,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.7
                    };
                },
                onEachFeature: function (feature, layer) {
                    if (feature.properties) {
                        layer.bindPopup(
                            Object.entries(feature.properties)
                                .map(([key, val]) => `<strong>${key}:</strong> ${val}`)
                                .join('<br>')
                        );
                    }
                }
            }).addTo(map);
        });
}

// Initial load
loadGeoJSON('hextemp.geojson');

// Handle dropdown selection
document.getElementById('dataset-select').addEventListener('change', function () {
    loadGeoJSON(this.value);
});
