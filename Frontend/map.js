// Initialize the map centered on the United States
var map = L.map('map').setView([37.0902, -95.7129], 4); 

// Add a tile layer (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Function to determine marker color based on erosion rate
function getColor(rate) {
    return rate > 3.5 ? "red" : 
           rate > 2.5 ? "orange" : 
           rate > 1.5 ? "yellow" : 
                        "green";
}

// Erosion Data for Various States
var erosionData = [
    // 🌊 Northeast
    { location: "Portland, ME", lat: 43.6591, lon: -70.2568, rate: 2.1, cause: "Wave action" },
    { location: "Boston, MA", lat: 42.3601, lon: -71.0589, rate: 2.4, cause: "Coastal development" },
    { location: "New York, NY", lat: 40.7128, lon: -74.0060, rate: 1.9, cause: "Storm surges" },
    { location: "Philadelphia, PA", lat: 39.9526, lon: -75.1652, rate: 2.5, cause: "River erosion" },
    { location: "Buffalo, NY", lat: 42.8864, lon: -78.8784, rate: 3.2, cause: "Lake erosion" },

    // 🌾 Midwest
    { location: "Chicago, IL", lat: 41.8781, lon: -87.6298, rate: 2.5, cause: "Lake erosion" },
    { location: "Indianapolis, IN", lat: 39.7684, lon: -86.1581, rate: 2.2, cause: "Soil erosion" },
    { location: "Detroit, MI", lat: 42.3314, lon: -83.0458, rate: 1.8, cause: "Wave action" },
    { location: "Minneapolis, MN", lat: 44.9778, lon: -93.2650, rate: 1.9, cause: "River sediment depletion" },
    { location: "St. Louis, MO", lat: 38.6273, lon: -90.1979, rate: 3.0, cause: "Mississippi Riverbank erosion" },

    // 🌊 Southeast
    { location: "Miami, FL", lat: 25.7617, lon: -80.1918, rate: 4.1, cause: "Hurricane impact" },
    { location: "Savannah, GA", lat: 32.0809, lon: -81.0912, rate: 2.7, cause: "Storm surges" },
    { location: "Charleston, SC", lat: 32.7765, lon: -79.9311, rate: 3.5, cause: "Coastal flooding" },
    { location: "Norfolk, VA", lat: 36.8508, lon: -76.2859, rate: 2.8, cause: "Wave action" },
    { location: "New Orleans, LA", lat: 29.9511, lon: -90.0715, rate: 4.5, cause: "Coastal subsidence" },

    // 🏜 Southwest
    { location: "Phoenix, AZ", lat: 33.4484, lon: -112.0740, rate: 3.2, cause: "Desertification" },
    { location: "Las Vegas, NV", lat: 36.1699, lon: -115.1398, rate: 2.9, cause: "Drought-induced erosion" },
    { location: "Santa Fe, NM", lat: 35.6870, lon: -105.9378, rate: 1.6, cause: "Soil degradation" },
    { location: "Dallas, TX", lat: 32.7767, lon: -96.7970, rate: 2.3, cause: "Urbanization runoff" },
    { location: "Houston, TX", lat: 29.7604, lon: -95.3698, rate: 3.8, cause: "Hurricane-induced erosion" },

    // 🏔 Rocky Mountains & Great Plains
    { location: "Denver, CO", lat: 39.7392, lon: -104.9903, rate: 2.1, cause: "Soil erosion" },
    { location: "Boise, ID", lat: 43.6150, lon: -116.2023, rate: 1.8, cause: "River erosion" },
    { location: "Cheyenne, WY", lat: 41.1399, lon: -104.8202, rate: 2.3, cause: "Wind erosion" },
    { location: "Bismarck, ND", lat: 46.8083, lon: -100.7837, rate: 2.6, cause: "Riverbank erosion" },
    { location: "Sioux Falls, SD", lat: 43.5446, lon: -96.7311, rate: 3.0, cause: "Agricultural runoff" },

    // 📍 Tennessee & Kentucky
    { location: "Nashville, TN", lat: 36.1627, lon: -86.7816, rate: 2.6, cause: "Riverbank erosion" },
    { location: "Louisville, KY", lat: 38.2527, lon: -85.7585, rate: 3.2, cause: "Flooding and erosion" },

    // 🌊 West Coast
    { location: "Seattle, WA", lat: 47.6062, lon: -122.3321, rate: 1.6, cause: "Wave action" },
    { location: "Portland, OR", lat: 45.5051, lon: -122.6750, rate: 3.1, cause: "Deforestation" },
    { location: "San Francisco, CA", lat: 37.7749, lon: -122.4194, rate: 2.8, cause: "Landslides" },
    { location: "San Diego, CA", lat: 32.7157, lon: -117.1611, rate: 1.9, cause: "Rising sea levels" },

    // 🏔 Alaska & Hawaii
    { location: "Anchorage, AK", lat: 61.2181, lon: -149.9003, rate: 4.7, cause: "Permafrost melting" },
    { location: "Honolulu, HI", lat: 21.3069, lon: -157.8583, rate: 3.4, cause: "Coral reef loss" }
];

// Loop through erosionData to add markers
erosionData.forEach(data => {
    L.circleMarker([data.lat, data.lon], {
        radius: 8,
        fillColor: getColor(data.rate),
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map)
    .bindPopup(`<b>${data.location}</b><br>
                <b>Erosion Rate:</b> ${data.rate} m/year<br>
                <b>Cause:</b> ${data.cause}`);
});