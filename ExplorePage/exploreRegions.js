document.addEventListener("DOMContentLoaded", () => {
  const globeContainer = document.getElementById("globeViz");
  const countryFilter = document.getElementById("countryFilter");
  const regionFilter = document.getElementById("regionFilter");

  if (!globeContainer) {
    console.error("❌ ERROR: Globe container #globeViz NOT found in the DOM!");
    return;
  }

  console.log("✅ Initializing Globe...");

  const wineRegions = {
    USA: { lat: 39.8283, lng: -98.5795, zoom: 1.5, regions: ["Napa Valley", "Sonoma County", "Central Coast, CA", "Oregon", "Washington", "Finger Lakes", "Willamette Valley", "Paso Robles"] },
    France: { lat: 46.6034, lng: 1.8883, zoom: 1.7, regions: ["Bordeaux", "Burgundy", "Loire Valley", "Champagne", "Rhone Valley", "Alsace", "Provence", "Languedoc"] },
    Italy: { lat: 41.8719, lng: 12.5674, zoom: 1.7, regions: ["Tuscany", "Piedmont", "Veneto", "Sicily", "Umbria", "Trentino-Alto Adige", "Friuli Venezia Giulia"] },
    Spain: { lat: 40.4637, lng: -3.7492, zoom: 1.8, regions: ["Rioja", "Priorat", "Ribera del Duero", "Penedès", "Galicia"] },
    Portugal: { lat: 39.3999, lng: -8.2245, zoom: 1.8, regions: ["Douro Valley", "Alentejo", "Madeira", "Vinho Verde"] },
    Australia: { lat: -25.2744, lng: 133.7751, zoom: 1.8, regions: ["Barossa Valley", "Hunter Valley", "Margaret River", "Yarra Valley", "Clare Valley"] },
    "New Zealand": { lat: -40.9006, lng: 174.8860, zoom: 1.8, regions: ["Marlborough", "Central Otago", "Hawke's Bay", "Gisborne"] },
    "South Africa": { lat: -30.5595, lng: 22.9375, zoom: 1.8, regions: ["Stellenbosch", "Swartland", "Paarl", "Constantia"] },
    Argentina: { lat: -38.4161, lng: -63.6167, zoom: 1.8, regions: ["Mendoza", "Patagonia", "Salta", "San Juan"] },
    Chile: { lat: -35.6751, lng: -71.5430, zoom: 1.8, regions: ["Maipo Valley", "Colchagua Valley", "Casablanca Valley", "Limarí Valley"] },
    Germany: { lat: 51.1657, lng: 10.4515, zoom: 1.8, regions: ["Mosel", "Rheingau", "Baden", "Franken", "Pfalz"] }
};

  const allLabels = [
    // USA
    { name: "Napa Valley", country: "USA", lat: 38.2975, lng: -122.2869 },
    { name: "Sonoma County", country: "USA", lat: 38.433, lng: -122.515 },
    { name: "Central Coast, CA", country: "USA", lat: 35.3733, lng: -120.855 },
    { name: "Oregon", country: "USA", lat: 45.5231, lng: -122.6765 },
    { name: "Washington", country: "USA", lat: 46.8523, lng: -120.7401 },
    { name: "Finger Lakes", country: "USA", lat: 42.795, lng: -76.963 },
    { name: "Willamette Valley", country: "USA", lat: 45.211, lng: -123.062 },
    { name: "Paso Robles", country: "USA", lat: 35.635, lng: -120.691 },

    // France
    { name: "Bordeaux", country: "France", lat: 44.8378, lng: -0.5792 },
    { name: "Burgundy", country: "France", lat: 47.0520, lng: 4.3833 },
    { name: "Loire Valley", country: "France", lat: 47.321, lng: 0.6848 },
    { name: "Champagne", country: "France", lat: 49.256, lng: 4.033 },
    { name: "Rhone Valley", country: "France", lat: 44.777, lng: 4.871 },
    { name: "Alsace", country: "France", lat: 48.318, lng: 7.441 },
    { name: "Provence", country: "France", lat: 43.551, lng: 6.634 },
    { name: "Languedoc", country: "France", lat: 43.611, lng: 3.877 },

    // Italy
    { name: "Tuscany", country: "Italy", lat: 43.7711, lng: 11.2486 },
    { name: "Piedmont", country: "Italy", lat: 44.693, lng: 7.678 },
    { name: "Veneto", country: "Italy", lat: 45.5, lng: 11.55 },
    { name: "Sicily", country: "Italy", lat: 37.599, lng: 14.015 },
    { name: "Umbria", country: "Italy", lat: 42.938, lng: 12.621 },
    { name: "Trentino-Alto Adige", country: "Italy", lat: 46.066, lng: 11.118 },
    { name: "Friuli Venezia Giulia", country: "Italy", lat: 45.650, lng: 13.776 },

    // Spain
    { name: "Rioja", country: "Spain", lat: 42.303, lng: -2.427 },
    { name: "Priorat", country: "Spain", lat: 41.2, lng: 0.766 },
    { name: "Ribera del Duero", country: "Spain", lat: 41.595, lng: -3.935 },
    { name: "Penedès", country: "Spain", lat: 41.347, lng: 1.698 },
    { name: "Galicia", country: "Spain", lat: 42.433, lng: -8.647 },

    // Portugal
    { name: "Douro Valley", country: "Portugal", lat: 41.160, lng: -7.720 },
    { name: "Alentejo", country: "Portugal", lat: 38.641, lng: -7.999 },
    { name: "Madeira", country: "Portugal", lat: 32.755, lng: -16.925 },
    { name: "Vinho Verde", country: "Portugal", lat: 41.736, lng: -8.293 },

    // Germany
    { name: "Mosel", country: "Germany", lat: 49.744, lng: 6.627 },
    { name: "Rheingau", country: "Germany", lat: 50.023, lng: 8.075 },
    { name: "Baden", country: "Germany", lat: 48.216, lng: 8.099 },
    { name: "Franken", country: "Germany", lat: 49.751, lng: 9.947 },
    { name: "Pfalz", country: "Germany", lat: 49.432, lng: 8.215 },

    // Australia
    { name: "Eden Valley", country: "Australia", lat: -34.554, lng: 139.054 },
    { name: "McLaren Vale", country: "Australia", lat: -35.219, lng: 138.546 }, 
    { name: "Coonawarra", country: "Australia", lat: -37.287, lng: 140.833 },

// New Zealand
    { name: "Wairarapa", country: "New Zealand", lat: -40.948, lng: 175.659 },
    { name: "Canterbury", country: "New Zealand", lat: -43.531, lng: 172.636 },

// South Africa
    { name: "Walker Bay", country: "South Africa", lat: -34.417, lng: 19.279 },
    { name: "Franschhoek", country: "South Africa", lat: -33.911, lng: 19.125 },

// Argentina
    { name: "La Rioja", country: "Argentina", lat: -29.413, lng: -66.855 },
    { name: "Catamarca", country: "Argentina", lat: -28.469, lng: -65.779 },

// Chile
    { name: "Aconcagua Valley", country: "Chile", lat: -32.830, lng: -70.706 },
    { name: "Itata Valley", country: "Chile", lat: -36.675, lng: -72.792 },
];

  // Generate multiple expanding rings per location
  const generateRings = (location) => {
    const rings = [];
    const numRings = 8;
    const baseSize = 1.0;
    const spacing = 0.15;

    for (let i = 0; i < numRings; i++) {
      rings.push({
        lat: location.lat,
        lng: location.lng,
        maxRadius: baseSize + i * spacing,
        propagationSpeed: 0.2 + i * 0.05,
        repeatPeriod: 4000 + i * 500,
        color: `rgba(255, 69, 0, ${0.9 - i * 0.1})`
      });
    }
    return rings;
  };

  const ringsData = allLabels.flatMap(generateRings);

  // Initialize the Globe
  const myGlobe = Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundColor('#121212')
    .ringsData(ringsData)
    .ringColor(d => d.color)
    .ringMaxRadius(d => d.maxRadius)
    .ringPropagationSpeed(d => d.propagationSpeed)
    .ringRepeatPeriod(d => d.repeatPeriod)
    .showAtmosphere(true)
    .atmosphereColor('rgba(158, 141, 141, 0.3)')
    .atmosphereAltitude(0.25);

  myGlobe(globeContainer);

  // **Enable Auto-Rotation**
  let autoRotate = true;
  const rotationSpeed = 0.02; // Adjust for smooth motion

  function rotateGlobe() {
    if (autoRotate) {
      const currentView = myGlobe.pointOfView();
      myGlobe.pointOfView({
        lat: currentView.lat,
        lng: currentView.lng + rotationSpeed,
        altitude: currentView.altitude
      });
      requestAnimationFrame(rotateGlobe);
    }
  }

  rotateGlobe(); // Start rotation on page load

  // **Stop Auto-Rotation on Interaction**
  function stopAutoRotate() {
    autoRotate = false;
  }

  globeContainer.addEventListener("mousedown", stopAutoRotate);
  globeContainer.addEventListener("touchstart", stopAutoRotate);

// **Track Current Zoom Level**
let currentZoomLevel = 2.0;  // Default globe altitude (higher value = farther away)

// **Stop Rotation and Apply Smooth Zoom**
function stopAndZoom(lat, lng, zoomFactor) {
  stopAutoRotate();
  currentZoomLevel = zoomFactor;  // Store new zoom level
  myGlobe.pointOfView({ lat, lng, altitude: zoomFactor }, 1500);
}

// **Country Selection - Zoom In More**
countryFilter.addEventListener("change", () => {
  const selectedCountry = countryFilter.value;
  console.log("🔍 Zooming to Country:", selectedCountry);

  regionFilter.innerHTML = '<option value="">Select a Region</option>';
  regionFilter.disabled = !selectedCountry;

  if (selectedCountry) {
    wineRegions[selectedCountry].regions.forEach(region => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region;
      regionFilter.appendChild(option);
    });

    // **Ensure country zooms in more than default**
    stopAndZoom(
      wineRegions[selectedCountry].lat, 
      wineRegions[selectedCountry].lng, 
      Math.max(0.7, currentZoomLevel * 0.6)  // Closer zoom level
    );
  }
});

// **Region Selection - Zoom Even Closer**
regionFilter.addEventListener("change", () => {
  const selectedRegion = regionFilter.value;
  console.log("🔍 Zooming to Region:", selectedRegion);

  const regionData = allLabels.find(d => d.name === selectedRegion);
  if (regionData) {
    stopAndZoom(regionData.lat, regionData.lng, Math.max(0.3, currentZoomLevel * 0.5));
  }
});

  // ✅ Globe Initialized
  console.log("✅ Globe Initialized with Auto-Rotation!");
}); // <-- Make sure this closing bracket exists